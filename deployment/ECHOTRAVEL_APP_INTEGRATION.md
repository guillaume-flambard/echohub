# EchoTravel App Integration with EchoHub

This guide shows you exactly what to implement in your EchoTravel app to integrate with EchoHub.

## What You'll Build

API endpoints in EchoTravel that allow EchoHub's Minerva AI to query your booking data and respond to user questions in the hub chat interface.

---

## Step 1: Get Your Service API Key

After EchoHub setup is complete, you'll receive a **Service API Key**. This is how EchoHub authenticates with your app.

**Example:** `echotravel_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

**Save this key** - you'll use it to verify requests from EchoHub.

---

## Step 2: Create Hub API Routes

Add these routes to your EchoTravel `routes/api.php`:

```php
<?php

use App\Http\Controllers\HubApiController;
use Illuminate\Support\Facades\Route;

// Hub API endpoints - authenticated by EchoHub service account
Route::prefix('hub')->middleware(['hub.auth'])->group(function () {
    Route::get('/health', [HubApiController::class, 'health']);
    Route::get('/bookings', [HubApiController::class, 'bookings']);
    Route::get('/revenue', [HubApiController::class, 'revenue']);
    Route::get('/analytics', [HubApiController::class, 'analytics']);
});
```

---

## Step 3: Create Authentication Middleware

Create `app/Http/Middleware/HubAuthMiddleware.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HubAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $apiKey = $request->bearerToken();

        if (!$apiKey) {
            return response()->json([
                'error' => 'Missing authentication token'
            ], 401);
        }

        // Verify the API key matches what EchoHub has
        // Store this in your .env as ECHOHUB_SERVICE_KEY
        if ($apiKey !== config('services.echohub.service_key')) {
            return response()->json([
                'error' => 'Invalid authentication token'
            ], 401);
        }

        return $next($request);
    }
}
```

**Register the middleware** in `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'hub.auth' => \App\Http\Middleware\HubAuthMiddleware::class,
    ]);
})
```

**Add to `.env`:**

```env
ECHOHUB_SERVICE_KEY=echotravel_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**Add to `config/services.php`:**

```php
'echohub' => [
    'service_key' => env('ECHOHUB_SERVICE_KEY'),
],
```

---

## Step 4: Create Hub API Controller

Create `app/Http/Controllers/HubApiController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\Request;

class HubApiController extends Controller
{
    /**
     * Health check endpoint
     */
    public function health()
    {
        return response()->json([
            'status' => 'ok',
            'app' => 'EchoTravel',
            'version' => '1.0.0',
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Get bookings with optional filters
     */
    public function bookings(Request $request)
    {
        $query = Booking::query();

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('check_in', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('check_in', '<=', $request->end_date);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Get bookings with property info
        $bookings = $query->with('property', 'guest')
            ->orderBy('check_in', 'desc')
            ->get()
            ->map(fn($booking) => [
                'id' => $booking->id,
                'property' => $booking->property->name,
                'guest' => $booking->guest->name,
                'check_in' => $booking->check_in->format('Y-m-d'),
                'check_out' => $booking->check_out->format('Y-m-d'),
                'status' => $booking->status,
                'total' => $booking->total_price,
                'nights' => $booking->nights,
            ]);

        // Get summary stats
        $stats = [
            'total_bookings' => Booking::count(),
            'total_revenue' => Booking::where('status', 'confirmed')->sum('total_price'),
            'active_bookings' => Booking::where('status', 'confirmed')
                ->where('check_in', '<=', now())
                ->where('check_out', '>=', now())
                ->count(),
        ];

        return response()->json([
            'bookings' => $bookings,
            'total' => $bookings->count(),
            'stats' => $stats,
        ]);
    }

    /**
     * Get revenue data
     */
    public function revenue(Request $request)
    {
        $period = $request->get('period', 'week');

        switch ($period) {
            case 'week':
                $startDate = now()->startOfWeek();
                $previousStart = now()->subWeek()->startOfWeek();
                break;
            case 'month':
                $startDate = now()->startOfMonth();
                $previousStart = now()->subMonth()->startOfMonth();
                break;
            case 'year':
                $startDate = now()->startOfYear();
                $previousStart = now()->subYear()->startOfYear();
                break;
            default:
                $startDate = now()->startOfWeek();
                $previousStart = now()->subWeek()->startOfWeek();
        }

        // Current period revenue
        $currentRevenue = Booking::where('created_at', '>=', $startDate)
            ->where('status', 'confirmed')
            ->sum('total_price');

        // Previous period revenue
        $previousRevenue = Booking::where('created_at', '>=', $previousStart)
            ->where('created_at', '<', $startDate)
            ->where('status', 'confirmed')
            ->sum('total_price');

        // Calculate change percentage
        $changePercent = $previousRevenue > 0
            ? (($currentRevenue - $previousRevenue) / $previousRevenue) * 100
            : 0;

        // Daily breakdown for current period
        $breakdown = Booking::selectRaw('DATE(created_at) as date, SUM(total_price) as revenue')
            ->where('created_at', '>=', $startDate)
            ->where('status', 'confirmed')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($item) => [
                'date' => $item->date,
                'revenue' => (float) $item->revenue,
            ]);

        return response()->json([
            'period' => $period,
            'revenue' => (float) $currentRevenue,
            'previous_revenue' => (float) $previousRevenue,
            'change_percent' => round($changePercent, 2),
            'breakdown' => $breakdown,
        ]);
    }

    /**
     * Get analytics data
     */
    public function analytics()
    {
        // Occupancy rate (last 30 days)
        $totalNights = 30; // Simplified - adjust based on your properties
        $bookedNights = Booking::where('check_in', '>=', now()->subDays(30))
            ->where('status', 'confirmed')
            ->sum('nights');
        $occupancyRate = $totalNights > 0 ? $bookedNights / $totalNights : 0;

        // Average stay duration
        $averageStay = Booking::where('status', 'confirmed')
            ->avg('nights') ?? 0;

        // Top properties
        $topProperties = Booking::selectRaw('property_id, COUNT(*) as booking_count')
            ->with('property')
            ->where('status', 'confirmed')
            ->groupBy('property_id')
            ->orderByDesc('booking_count')
            ->limit(5)
            ->get()
            ->map(fn($item) => [
                'name' => $item->property->name,
                'bookings' => $item->booking_count,
            ]);

        return response()->json([
            'occupancy_rate' => round($occupancyRate, 2),
            'average_stay' => round($averageStay, 1),
            'top_properties' => $topProperties,
        ]);
    }
}
```

---

## Step 5: Adjust Based on Your Models

The example above assumes you have:
- `Booking` model with `property`, `guest` relationships
- Fields: `check_in`, `check_out`, `status`, `total_price`, `nights`

**Adjust the controller** to match your actual database schema and models.

---

## Step 6: Test Your Endpoints

Test each endpoint with curl:

```bash
# Set your API key
API_KEY="echotravel_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"

# Test health check
curl -H "Authorization: Bearer $API_KEY" \
     https://echotravels.app/api/hub/health

# Expected: {"status":"ok","app":"EchoTravel",...}

# Test bookings
curl -H "Authorization: Bearer $API_KEY" \
     https://echotravels.app/api/hub/bookings

# Expected: {"bookings":[...],"total":...,"stats":{...}}

# Test revenue
curl -H "Authorization: Bearer $API_KEY" \
     https://echotravels.app/api/hub/revenue?period=week

# Expected: {"period":"week","revenue":...,"change_percent":...}

# Test analytics
curl -H "Authorization: Bearer $API_KEY" \
     https://echotravels.app/api/hub/analytics

# Expected: {"occupancy_rate":...,"average_stay":...,"top_properties":[...]}
```

---

## Step 7: Deploy

Deploy your changes to production:

```bash
# Commit your changes
git add .
git commit -m "Add EchoHub integration endpoints"

# Deploy to production
git push origin main
```

Make sure to add the `ECHOHUB_SERVICE_KEY` to your production `.env`.

---

## How It Works

1. **User asks in EchoHub:** "How many bookings this week?"
2. **Minerva AI processes:** Determines it needs booking data
3. **EchoHub calls your API:** `GET /api/hub/bookings?start_date=2025-10-01`
4. **Your app responds:** Returns JSON with booking data
5. **Minerva AI generates response:** "You have 47 bookings this week, up 12% from last week."
6. **User sees the answer:** In the hub chat interface

---

## Security Notes

- ✅ Service API key stored in `.env`, never in code
- ✅ Middleware validates Bearer token on every request
- ✅ HTTPS required (handled by your SSL certificate)
- ✅ Rate limiting recommended (add to middleware group)

---

## Optional: Add Rate Limiting

Protect your endpoints from abuse:

```php
Route::prefix('hub')
    ->middleware(['hub.auth', 'throttle:60,1']) // 60 requests per minute
    ->group(function () {
        // Your routes...
    });
```

---

## Troubleshooting

### 401 Unauthorized

**Check:**
- API key in `.env` matches what EchoHub has
- Middleware is registered correctly
- Request includes `Authorization: Bearer YOUR_KEY` header

### 500 Server Error

**Check:**
- Laravel logs: `tail -f storage/logs/laravel.log`
- Database connections working
- Models and relationships exist

### Empty Data

**Check:**
- Database has bookings
- Query filters aren't too restrictive
- Relationships loaded correctly

---

## Example Minerva AI Conversations

**User:** "How many bookings this week?"
**Minerva:** "You have 47 bookings this week, generating $5,600 in revenue. That's up 12% from last week."

**User:** "What's my top property?"
**Minerva:** "Beach Villa is your top property with 23 bookings, followed by Garden Cottage with 18 bookings."

**User:** "Show revenue for this month"
**Minerva:** "This month's revenue is $18,450, which is 8% higher than last month. Peak days were October 10-12 with $2,100."

---

## That's It!

Your EchoTravel app is now integrated with EchoHub. Users can ask questions about bookings, revenue, and analytics directly in the hub chat interface, and Minerva AI will query your API to provide intelligent responses.

**Questions?** Check the logs and verify each step was completed.
