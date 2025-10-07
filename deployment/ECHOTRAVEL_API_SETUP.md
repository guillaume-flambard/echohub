# EchoTravel API Access Setup

Quick guide to add API endpoints in EchoTravel for EchoHub integration.

## Overview

EchoHub will call your EchoTravel API to get booking data, revenue, and analytics. You need to implement 4 endpoints that return JSON data.

---

## Step 1: Get Your Service API Key

After running the EchoHub seeder, you'll get a service API key:

```bash
# In EchoHub
php artisan db:seed --class=AppSeeder
```

**Output will show:**
```
🔑 EchoTravel API Key (save this for app configuration):
   echotravel_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...
```

**Save this key!** You'll use it in Step 3.

---

## Step 2: Add Routes in EchoTravel

In `routes/api.php`:

```php
<?php

use App\Http\Controllers\HubApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('hub')
    ->middleware(['hub.auth'])
    ->group(function () {
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

        if (!$apiKey || $apiKey !== config('services.echohub.service_key')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
```

**Register in `bootstrap/app.php`:**

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'hub.auth' => \App\Http\Middleware\HubAuthMiddleware::class,
    ]);
})
```

---

## Step 4: Add API Key to Environment

In `.env`:

```env
ECHOHUB_SERVICE_KEY=echotravel_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...
```

In `config/services.php`:

```php
return [
    // ... other services

    'echohub' => [
        'service_key' => env('ECHOHUB_SERVICE_KEY'),
    ],
];
```

---

## Step 5: Create Hub API Controller

Create `app/Http/Controllers/HubApiController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class HubApiController extends Controller
{
    /**
     * Health check
     */
    public function health()
    {
        return response()->json([
            'status' => 'ok',
            'app' => 'EchoTravel',
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Get bookings
     */
    public function bookings(Request $request)
    {
        $query = Booking::query()->with('property', 'guest');

        // Filters
        if ($request->start_date) {
            $query->where('check_in', '>=', $request->start_date);
        }
        if ($request->end_date) {
            $query->where('check_in', '<=', $request->end_date);
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }

        $bookings = $query->orderBy('check_in', 'desc')
            ->get()
            ->map(fn($b) => [
                'id' => $b->id,
                'property' => $b->property->name,
                'guest' => $b->guest->name,
                'check_in' => $b->check_in->format('Y-m-d'),
                'check_out' => $b->check_out->format('Y-m-d'),
                'status' => $b->status,
                'total' => $b->total_price,
            ]);

        return response()->json([
            'bookings' => $bookings,
            'total' => $bookings->count(),
            'stats' => [
                'total_bookings' => Booking::count(),
                'total_revenue' => Booking::where('status', 'confirmed')->sum('total_price'),
            ],
        ]);
    }

    /**
     * Get revenue
     */
    public function revenue(Request $request)
    {
        $period = $request->get('period', 'week');

        switch ($period) {
            case 'week':
                $start = now()->startOfWeek();
                $prevStart = now()->subWeek()->startOfWeek();
                break;
            case 'month':
                $start = now()->startOfMonth();
                $prevStart = now()->subMonth()->startOfMonth();
                break;
            default:
                $start = now()->startOfWeek();
                $prevStart = now()->subWeek()->startOfWeek();
        }

        $current = Booking::where('created_at', '>=', $start)
            ->where('status', 'confirmed')
            ->sum('total_price');

        $previous = Booking::where('created_at', '>=', $prevStart)
            ->where('created_at', '<', $start)
            ->where('status', 'confirmed')
            ->sum('total_price');

        $change = $previous > 0 ? (($current - $previous) / $previous) * 100 : 0;

        return response()->json([
            'period' => $period,
            'revenue' => (float) $current,
            'previous_revenue' => (float) $previous,
            'change_percent' => round($change, 2),
        ]);
    }

    /**
     * Get analytics
     */
    public function analytics()
    {
        $avgStay = Booking::where('status', 'confirmed')->avg('nights') ?? 0;

        $topProperties = Booking::selectRaw('property_id, COUNT(*) as count')
            ->with('property')
            ->where('status', 'confirmed')
            ->groupBy('property_id')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(fn($item) => [
                'name' => $item->property->name,
                'bookings' => $item->count,
            ]);

        return response()->json([
            'average_stay' => round($avgStay, 1),
            'top_properties' => $topProperties,
        ]);
    }
}
```

---

## Step 6: Adjust for Your Schema

The controller above assumes you have:
- `Booking` model
- Relationships: `property`, `guest`
- Fields: `check_in`, `check_out`, `status`, `total_price`, `nights`

**Adjust the code** to match your actual database schema.

---

## Step 7: Test Your API

```bash
# Set your API key
API_KEY="echotravel_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6..."

# Test health
curl -H "Authorization: Bearer $API_KEY" \
     http://echotravels.test/api/hub/health

# Expected: {"status":"ok","app":"EchoTravel",...}

# Test bookings
curl -H "Authorization: Bearer $API_KEY" \
     http://echotravels.test/api/hub/bookings

# Test revenue
curl -H "Authorization: Bearer $API_KEY" \
     http://echotravels.test/api/hub/revenue?period=week

# Test analytics
curl -H "Authorization: Bearer $API_KEY" \
     http://echotravels.test/api/hub/analytics
```

---

## Step 8: Deploy to Production

```bash
# Commit changes
git add .
git commit -m "Add EchoHub API integration"
git push

# Add to production .env
ECHOHUB_SERVICE_KEY=your_production_key_here

# Clear cache
php artisan config:clear
```

---

## API Reference

### Health Check
```
GET /api/hub/health
```

**Response:**
```json
{
  "status": "ok",
  "app": "EchoTravel",
  "timestamp": "2025-10-07T10:30:00Z"
}
```

---

### Get Bookings
```
GET /api/hub/bookings
Query params: ?start_date=2025-10-01&end_date=2025-10-31&status=confirmed
```

**Response:**
```json
{
  "bookings": [
    {
      "id": 1,
      "property": "Beach Villa",
      "guest": "John Doe",
      "check_in": "2025-10-10",
      "check_out": "2025-10-15",
      "status": "confirmed",
      "total": 1500.00
    }
  ],
  "total": 1,
  "stats": {
    "total_bookings": 47,
    "total_revenue": 12450.00
  }
}
```

---

### Get Revenue
```
GET /api/hub/revenue?period=week
Periods: week, month
```

**Response:**
```json
{
  "period": "week",
  "revenue": 5600.00,
  "previous_revenue": 5000.00,
  "change_percent": 12.0
}
```

---

### Get Analytics
```
GET /api/hub/analytics
```

**Response:**
```json
{
  "average_stay": 4.2,
  "top_properties": [
    {"name": "Beach Villa", "bookings": 23},
    {"name": "Garden Cottage", "bookings": 18}
  ]
}
```

---

## Troubleshooting

### 401 Unauthorized
- Check API key in `.env` matches what EchoHub has
- Verify middleware is registered
- Ensure request has `Authorization: Bearer YOUR_KEY` header

### 500 Server Error
- Check Laravel logs: `tail -f storage/logs/laravel.log`
- Verify relationships exist on models
- Confirm database has data

### CORS Errors
Add to middleware if calling from browser:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
```

---

## Security Checklist

- ✅ API key stored in `.env`, never in code
- ✅ Middleware validates every request
- ✅ HTTPS required in production
- ✅ Rate limiting (optional): `->middleware(['hub.auth', 'throttle:60,1'])`
- ✅ Different API keys for production/staging

---

## Next Steps

1. **Test locally** - Verify all endpoints work
2. **Deploy to production** - Add service key to production `.env`
3. **Configure EchoHub** - Follow `ECHOTRAVEL_SETUP_CHECKLIST.md`
4. **Start Minerva bot** - Enable AI responses
5. **Test integration** - Chat with EchoTravel in hub

---

**Questions?** Check:
- Full integration guide: `ECHOTRAVEL_APP_INTEGRATION.md`
- Setup checklist: `ECHOTRAVEL_SETUP_CHECKLIST.md`
- Laravel logs for errors

---

**That's it!** Your EchoTravel API is ready for EchoHub integration 🎉