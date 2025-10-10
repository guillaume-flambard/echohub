import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import users from './users'
import contacts from './contacts'
/**
* @see \App\Http\Controllers\Api\ExternalApiController::health
* @see app/Http/Controllers/Api/ExternalApiController.php:149
* @route '/api/external/health'
*/
export const health = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})

health.definition = {
    methods: ["get","head"],
    url: '/api/external/health',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExternalApiController::health
* @see app/Http/Controllers/Api/ExternalApiController.php:149
* @route '/api/external/health'
*/
health.url = (options?: RouteQueryOptions) => {
    return health.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExternalApiController::health
* @see app/Http/Controllers/Api/ExternalApiController.php:149
* @route '/api/external/health'
*/
health.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::health
* @see app/Http/Controllers/Api/ExternalApiController.php:149
* @route '/api/external/health'
*/
health.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: health.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::health
* @see app/Http/Controllers/Api/ExternalApiController.php:149
* @route '/api/external/health'
*/
const healthForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: health.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::health
* @see app/Http/Controllers/Api/ExternalApiController.php:149
* @route '/api/external/health'
*/
healthForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: health.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::health
* @see app/Http/Controllers/Api/ExternalApiController.php:149
* @route '/api/external/health'
*/
healthForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: health.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

health.form = healthForm

/**
* @see \App\Http\Controllers\Api\ExternalApiController::metadata
* @see app/Http/Controllers/Api/ExternalApiController.php:161
* @route '/api/external/metadata'
*/
export const metadata = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metadata.url(options),
    method: 'get',
})

metadata.definition = {
    methods: ["get","head"],
    url: '/api/external/metadata',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExternalApiController::metadata
* @see app/Http/Controllers/Api/ExternalApiController.php:161
* @route '/api/external/metadata'
*/
metadata.url = (options?: RouteQueryOptions) => {
    return metadata.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExternalApiController::metadata
* @see app/Http/Controllers/Api/ExternalApiController.php:161
* @route '/api/external/metadata'
*/
metadata.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: metadata.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::metadata
* @see app/Http/Controllers/Api/ExternalApiController.php:161
* @route '/api/external/metadata'
*/
metadata.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: metadata.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::metadata
* @see app/Http/Controllers/Api/ExternalApiController.php:161
* @route '/api/external/metadata'
*/
const metadataForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: metadata.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::metadata
* @see app/Http/Controllers/Api/ExternalApiController.php:161
* @route '/api/external/metadata'
*/
metadataForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: metadata.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::metadata
* @see app/Http/Controllers/Api/ExternalApiController.php:161
* @route '/api/external/metadata'
*/
metadataForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: metadata.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

metadata.form = metadataForm

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::verify
* @see app/Http/Controllers/Api/ServiceAccountController.php:167
* @route '/api/external/verify'
*/
export const verify = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verify.url(options),
    method: 'get',
})

verify.definition = {
    methods: ["get","head"],
    url: '/api/external/verify',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::verify
* @see app/Http/Controllers/Api/ServiceAccountController.php:167
* @route '/api/external/verify'
*/
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::verify
* @see app/Http/Controllers/Api/ServiceAccountController.php:167
* @route '/api/external/verify'
*/
verify.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verify.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::verify
* @see app/Http/Controllers/Api/ServiceAccountController.php:167
* @route '/api/external/verify'
*/
verify.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verify.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::verify
* @see app/Http/Controllers/Api/ServiceAccountController.php:167
* @route '/api/external/verify'
*/
const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verify.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::verify
* @see app/Http/Controllers/Api/ServiceAccountController.php:167
* @route '/api/external/verify'
*/
verifyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verify.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::verify
* @see app/Http/Controllers/Api/ServiceAccountController.php:167
* @route '/api/external/verify'
*/
verifyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: verify.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

verify.form = verifyForm

/**
* @see \App\Http\Controllers\Api\ExternalApiController::search
* @see app/Http/Controllers/Api/ExternalApiController.php:194
* @route '/api/external/search'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/api/external/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExternalApiController::search
* @see app/Http/Controllers/Api/ExternalApiController.php:194
* @route '/api/external/search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExternalApiController::search
* @see app/Http/Controllers/Api/ExternalApiController.php:194
* @route '/api/external/search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::search
* @see app/Http/Controllers/Api/ExternalApiController.php:194
* @route '/api/external/search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::search
* @see app/Http/Controllers/Api/ExternalApiController.php:194
* @route '/api/external/search'
*/
const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::search
* @see app/Http/Controllers/Api/ExternalApiController.php:194
* @route '/api/external/search'
*/
searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::search
* @see app/Http/Controllers/Api/ExternalApiController.php:194
* @route '/api/external/search'
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

const external = {
    health: Object.assign(health, health),
    metadata: Object.assign(metadata, metadata),
    verify: Object.assign(verify, verify),
    users: Object.assign(users, users),
    contacts: Object.assign(contacts, contacts),
    search: Object.assign(search, search),
}

export default external