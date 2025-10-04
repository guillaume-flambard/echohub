<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\MinervaContext;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();

        // Get total apps for this user
        $totalApps = Contact::where('user_id', $user->id)
            ->where('type', 'app')
            ->count();

        // Get apps online count
        $appsOnline = Contact::where('user_id', $user->id)
            ->where('type', 'app')
            ->whereHas('app', function ($query) {
                $query->where('status', 'online');
            })
            ->count();

        // Get total messages today
        $messagesToday = MinervaContext::where('user_id', $user->id)
            ->whereJsonLength('conversation_history', '>', 0)
            ->get()
            ->sum(function ($context) {
                $history = $context->conversation_history ?? [];
                $today = now()->startOfDay();

                return collect($history)->filter(function ($message) use ($today) {
                    $timestamp = data_get($message, 'timestamp');

                    return $timestamp && now()->parse($timestamp)->gte($today);
                })->count();
            });

        // Get active conversations (contexts with messages)
        $activeConversations = MinervaContext::where('user_id', $user->id)
            ->whereJsonLength('conversation_history', '>', 0)
            ->count();

        return response()->json([
            'total_apps' => $totalApps,
            'apps_online' => $appsOnline,
            'messages_today' => $messagesToday,
            'active_conversations' => $activeConversations,
        ]);
    }

    public function recentActivity(Request $request)
    {
        $user = $request->user();

        // Get recent messages from all conversations
        $contexts = MinervaContext::where('user_id', $user->id)
            ->whereJsonLength('conversation_history', '>', 0)
            ->with('contact.app')
            ->get();

        $recentMessages = [];

        foreach ($contexts as $context) {
            // Skip if contact doesn't exist (orphaned context)
            if (! $context->contact) {
                continue;
            }

            $history = $context->conversation_history ?? [];
            foreach ($history as $message) {
                $recentMessages[] = [
                    'contact' => [
                        'id' => $context->contact->id,
                        'name' => $context->contact->name,
                        'type' => $context->contact->type,
                    ],
                    'message' => $message,
                ];
            }
        }

        // Sort by timestamp descending and take 10
        usort($recentMessages, function ($a, $b) {
            $aTime = data_get($a, 'message.timestamp');
            $bTime = data_get($b, 'message.timestamp');

            return strcmp($bTime, $aTime);
        });

        return response()->json([
            'recent_activity' => array_slice($recentMessages, 0, 10),
        ]);
    }

    public function bookingTrends(Request $request)
    {
        $user = $request->user();

        // Get last 7 days of message activity
        $trends = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->startOfDay();
            $dateEnd = $date->copy()->endOfDay();

            // Count messages for this day
            $messageCount = MinervaContext::where('user_id', $user->id)
                ->get()
                ->sum(function ($context) use ($date, $dateEnd) {
                    $history = $context->conversation_history ?? [];

                    return collect($history)->filter(function ($message) use ($date, $dateEnd) {
                        $timestamp = data_get($message, 'timestamp');
                        if (! $timestamp) {
                            return false;
                        }

                        $messageDate = now()->parse($timestamp);

                        return $messageDate->gte($date) && $messageDate->lte($dateEnd);
                    })->count();
                });

            $trends[] = [
                'date' => $date->format('Y-m-d'),
                'day' => $date->format('D'),
                'short_date' => $date->format('M d'),
                'messages' => $messageCount,
            ];
        }

        return response()->json([
            'trends' => $trends,
        ]);
    }
}
