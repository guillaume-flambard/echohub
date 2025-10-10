import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hub\AggregatorController::index
* @see app/Http/Controllers/Hub/AggregatorController.php:25
* @route '/hub/aggregator'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hub/aggregator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\AggregatorController::index
* @see app/Http/Controllers/Hub/AggregatorController.php:25
* @route '/hub/aggregator'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\AggregatorController::index
* @see app/Http/Controllers/Hub/AggregatorController.php:25
* @route '/hub/aggregator'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::index
* @see app/Http/Controllers/Hub/AggregatorController.php:25
* @route '/hub/aggregator'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::index
* @see app/Http/Controllers/Hub/AggregatorController.php:25
* @route '/hub/aggregator'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::index
* @see app/Http/Controllers/Hub/AggregatorController.php:25
* @route '/hub/aggregator'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::index
* @see app/Http/Controllers/Hub/AggregatorController.php:25
* @route '/hub/aggregator'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Hub\AggregatorController::stats
* @see app/Http/Controllers/Hub/AggregatorController.php:45
* @route '/hub/aggregator/stats'
*/
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/hub/aggregator/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\AggregatorController::stats
* @see app/Http/Controllers/Hub/AggregatorController.php:45
* @route '/hub/aggregator/stats'
*/
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\AggregatorController::stats
* @see app/Http/Controllers/Hub/AggregatorController.php:45
* @route '/hub/aggregator/stats'
*/
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::stats
* @see app/Http/Controllers/Hub/AggregatorController.php:45
* @route '/hub/aggregator/stats'
*/
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::stats
* @see app/Http/Controllers/Hub/AggregatorController.php:45
* @route '/hub/aggregator/stats'
*/
const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::stats
* @see app/Http/Controllers/Hub/AggregatorController.php:45
* @route '/hub/aggregator/stats'
*/
statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::stats
* @see app/Http/Controllers/Hub/AggregatorController.php:45
* @route '/hub/aggregator/stats'
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
* @see \App\Http\Controllers\Hub\AggregatorController::activity
* @see app/Http/Controllers/Hub/AggregatorController.php:120
* @route '/hub/aggregator/activity'
*/
export const activity = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activity.url(options),
    method: 'get',
})

activity.definition = {
    methods: ["get","head"],
    url: '/hub/aggregator/activity',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\AggregatorController::activity
* @see app/Http/Controllers/Hub/AggregatorController.php:120
* @route '/hub/aggregator/activity'
*/
activity.url = (options?: RouteQueryOptions) => {
    return activity.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\AggregatorController::activity
* @see app/Http/Controllers/Hub/AggregatorController.php:120
* @route '/hub/aggregator/activity'
*/
activity.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activity.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::activity
* @see app/Http/Controllers/Hub/AggregatorController.php:120
* @route '/hub/aggregator/activity'
*/
activity.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: activity.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::activity
* @see app/Http/Controllers/Hub/AggregatorController.php:120
* @route '/hub/aggregator/activity'
*/
const activityForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: activity.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::activity
* @see app/Http/Controllers/Hub/AggregatorController.php:120
* @route '/hub/aggregator/activity'
*/
activityForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: activity.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::activity
* @see app/Http/Controllers/Hub/AggregatorController.php:120
* @route '/hub/aggregator/activity'
*/
activityForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: activity.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

activity.form = activityForm

/**
* @see \App\Http\Controllers\Hub\AggregatorController::search
* @see app/Http/Controllers/Hub/AggregatorController.php:157
* @route '/hub/aggregator/search'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/hub/aggregator/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\AggregatorController::search
* @see app/Http/Controllers/Hub/AggregatorController.php:157
* @route '/hub/aggregator/search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\AggregatorController::search
* @see app/Http/Controllers/Hub/AggregatorController.php:157
* @route '/hub/aggregator/search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::search
* @see app/Http/Controllers/Hub/AggregatorController.php:157
* @route '/hub/aggregator/search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::search
* @see app/Http/Controllers/Hub/AggregatorController.php:157
* @route '/hub/aggregator/search'
*/
const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::search
* @see app/Http/Controllers/Hub/AggregatorController.php:157
* @route '/hub/aggregator/search'
*/
searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::search
* @see app/Http/Controllers/Hub/AggregatorController.php:157
* @route '/hub/aggregator/search'
*/
searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

search.form = searchForm

/**
* @see \App\Http\Controllers\Hub\AggregatorController::logs
* @see app/Http/Controllers/Hub/AggregatorController.php:206
* @route '/hub/aggregator/logs'
*/
export const logs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logs.url(options),
    method: 'get',
})

logs.definition = {
    methods: ["get","head"],
    url: '/hub/aggregator/logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\AggregatorController::logs
* @see app/Http/Controllers/Hub/AggregatorController.php:206
* @route '/hub/aggregator/logs'
*/
logs.url = (options?: RouteQueryOptions) => {
    return logs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\AggregatorController::logs
* @see app/Http/Controllers/Hub/AggregatorController.php:206
* @route '/hub/aggregator/logs'
*/
logs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::logs
* @see app/Http/Controllers/Hub/AggregatorController.php:206
* @route '/hub/aggregator/logs'
*/
logs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logs.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::logs
* @see app/Http/Controllers/Hub/AggregatorController.php:206
* @route '/hub/aggregator/logs'
*/
const logsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: logs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::logs
* @see app/Http/Controllers/Hub/AggregatorController.php:206
* @route '/hub/aggregator/logs'
*/
logsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: logs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::logs
* @see app/Http/Controllers/Hub/AggregatorController.php:206
* @route '/hub/aggregator/logs'
*/
logsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: logs.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

logs.form = logsForm

/**
* @see \App\Http\Controllers\Hub\AggregatorController::analytics
* @see app/Http/Controllers/Hub/AggregatorController.php:253
* @route '/hub/aggregator/analytics'
*/
export const analytics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

analytics.definition = {
    methods: ["get","head"],
    url: '/hub/aggregator/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\AggregatorController::analytics
* @see app/Http/Controllers/Hub/AggregatorController.php:253
* @route '/hub/aggregator/analytics'
*/
analytics.url = (options?: RouteQueryOptions) => {
    return analytics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\AggregatorController::analytics
* @see app/Http/Controllers/Hub/AggregatorController.php:253
* @route '/hub/aggregator/analytics'
*/
analytics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::analytics
* @see app/Http/Controllers/Hub/AggregatorController.php:253
* @route '/hub/aggregator/analytics'
*/
analytics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::analytics
* @see app/Http/Controllers/Hub/AggregatorController.php:253
* @route '/hub/aggregator/analytics'
*/
const analyticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::analytics
* @see app/Http/Controllers/Hub/AggregatorController.php:253
* @route '/hub/aggregator/analytics'
*/
analyticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AggregatorController::analytics
* @see app/Http/Controllers/Hub/AggregatorController.php:253
* @route '/hub/aggregator/analytics'
*/
analyticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

analytics.form = analyticsForm

const AggregatorController = { index, stats, activity, search, logs, analytics }

export default AggregatorController