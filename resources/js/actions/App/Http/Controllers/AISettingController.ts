import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AISettingController::index
* @see app/Http/Controllers/AISettingController.php:14
* @route '/api/ai-settings'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/ai-settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AISettingController::index
* @see app/Http/Controllers/AISettingController.php:14
* @route '/api/ai-settings'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AISettingController::index
* @see app/Http/Controllers/AISettingController.php:14
* @route '/api/ai-settings'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AISettingController::index
* @see app/Http/Controllers/AISettingController.php:14
* @route '/api/ai-settings'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AISettingController::index
* @see app/Http/Controllers/AISettingController.php:14
* @route '/api/ai-settings'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AISettingController::index
* @see app/Http/Controllers/AISettingController.php:14
* @route '/api/ai-settings'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AISettingController::index
* @see app/Http/Controllers/AISettingController.php:14
* @route '/api/ai-settings'
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
* @see \App\Http\Controllers\AISettingController::update
* @see app/Http/Controllers/AISettingController.php:44
* @route '/api/ai-settings'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/ai-settings',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AISettingController::update
* @see app/Http/Controllers/AISettingController.php:44
* @route '/api/ai-settings'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AISettingController::update
* @see app/Http/Controllers/AISettingController.php:44
* @route '/api/ai-settings'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AISettingController::update
* @see app/Http/Controllers/AISettingController.php:44
* @route '/api/ai-settings'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AISettingController::update
* @see app/Http/Controllers/AISettingController.php:44
* @route '/api/ai-settings'
*/
updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\AISettingController::availableModels
* @see app/Http/Controllers/AISettingController.php:80
* @route '/api/ai-settings/models'
*/
export const availableModels = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableModels.url(options),
    method: 'get',
})

availableModels.definition = {
    methods: ["get","head"],
    url: '/api/ai-settings/models',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AISettingController::availableModels
* @see app/Http/Controllers/AISettingController.php:80
* @route '/api/ai-settings/models'
*/
availableModels.url = (options?: RouteQueryOptions) => {
    return availableModels.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AISettingController::availableModels
* @see app/Http/Controllers/AISettingController.php:80
* @route '/api/ai-settings/models'
*/
availableModels.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableModels.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AISettingController::availableModels
* @see app/Http/Controllers/AISettingController.php:80
* @route '/api/ai-settings/models'
*/
availableModels.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: availableModels.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AISettingController::availableModels
* @see app/Http/Controllers/AISettingController.php:80
* @route '/api/ai-settings/models'
*/
const availableModelsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableModels.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AISettingController::availableModels
* @see app/Http/Controllers/AISettingController.php:80
* @route '/api/ai-settings/models'
*/
availableModelsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableModels.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AISettingController::availableModels
* @see app/Http/Controllers/AISettingController.php:80
* @route '/api/ai-settings/models'
*/
availableModelsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableModels.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

availableModels.form = availableModelsForm

const AISettingController = { index, update, availableModels }

export default AISettingController