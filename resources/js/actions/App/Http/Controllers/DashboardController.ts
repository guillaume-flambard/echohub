import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::stats
* @see app/Http/Controllers/DashboardController.php:11
* @route '/api/dashboard/stats'
*/
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::stats
* @see app/Http/Controllers/DashboardController.php:11
* @route '/api/dashboard/stats'
*/
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::stats
* @see app/Http/Controllers/DashboardController.php:11
* @route '/api/dashboard/stats'
*/
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::stats
* @see app/Http/Controllers/DashboardController.php:11
* @route '/api/dashboard/stats'
*/
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::stats
* @see app/Http/Controllers/DashboardController.php:11
* @route '/api/dashboard/stats'
*/
const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::stats
* @see app/Http/Controllers/DashboardController.php:11
* @route '/api/dashboard/stats'
*/
statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::stats
* @see app/Http/Controllers/DashboardController.php:11
* @route '/api/dashboard/stats'
*/
statsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

stats.form = statsForm

/**
* @see \App\Http\Controllers\DashboardController::recentActivity
* @see app/Http/Controllers/DashboardController.php:58
* @route '/api/dashboard/activity'
*/
export const recentActivity = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recentActivity.url(options),
    method: 'get',
})

recentActivity.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/activity',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::recentActivity
* @see app/Http/Controllers/DashboardController.php:58
* @route '/api/dashboard/activity'
*/
recentActivity.url = (options?: RouteQueryOptions) => {
    return recentActivity.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::recentActivity
* @see app/Http/Controllers/DashboardController.php:58
* @route '/api/dashboard/activity'
*/
recentActivity.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recentActivity.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::recentActivity
* @see app/Http/Controllers/DashboardController.php:58
* @route '/api/dashboard/activity'
*/
recentActivity.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recentActivity.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::recentActivity
* @see app/Http/Controllers/DashboardController.php:58
* @route '/api/dashboard/activity'
*/
const recentActivityForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: recentActivity.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::recentActivity
* @see app/Http/Controllers/DashboardController.php:58
* @route '/api/dashboard/activity'
*/
recentActivityForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: recentActivity.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::recentActivity
* @see app/Http/Controllers/DashboardController.php:58
* @route '/api/dashboard/activity'
*/
recentActivityForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: recentActivity.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

recentActivity.form = recentActivityForm

/**
* @see \App\Http\Controllers\DashboardController::bookingTrends
* @see app/Http/Controllers/DashboardController.php:106
* @route '/api/dashboard/trends'
*/
export const bookingTrends = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bookingTrends.url(options),
    method: 'get',
})

bookingTrends.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/trends',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::bookingTrends
* @see app/Http/Controllers/DashboardController.php:106
* @route '/api/dashboard/trends'
*/
bookingTrends.url = (options?: RouteQueryOptions) => {
    return bookingTrends.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::bookingTrends
* @see app/Http/Controllers/DashboardController.php:106
* @route '/api/dashboard/trends'
*/
bookingTrends.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bookingTrends.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::bookingTrends
* @see app/Http/Controllers/DashboardController.php:106
* @route '/api/dashboard/trends'
*/
bookingTrends.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bookingTrends.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::bookingTrends
* @see app/Http/Controllers/DashboardController.php:106
* @route '/api/dashboard/trends'
*/
const bookingTrendsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bookingTrends.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::bookingTrends
* @see app/Http/Controllers/DashboardController.php:106
* @route '/api/dashboard/trends'
*/
bookingTrendsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bookingTrends.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::bookingTrends
* @see app/Http/Controllers/DashboardController.php:106
* @route '/api/dashboard/trends'
*/
bookingTrendsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bookingTrends.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

bookingTrends.form = bookingTrendsForm

const DashboardController = { stats, recentActivity, bookingTrends }

export default DashboardController