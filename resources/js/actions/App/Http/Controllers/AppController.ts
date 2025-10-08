import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AppController::index
* @see app/Http/Controllers/AppController.php:15
* @route '/api/apps'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/apps',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AppController::index
* @see app/Http/Controllers/AppController.php:15
* @route '/api/apps'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppController::index
* @see app/Http/Controllers/AppController.php:15
* @route '/api/apps'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppController::index
* @see app/Http/Controllers/AppController.php:15
* @route '/api/apps'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AppController::index
* @see app/Http/Controllers/AppController.php:15
* @route '/api/apps'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppController::index
* @see app/Http/Controllers/AppController.php:15
* @route '/api/apps'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppController::index
* @see app/Http/Controllers/AppController.php:15
* @route '/api/apps'
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
* @see \App\Http\Controllers\AppController::store
* @see app/Http/Controllers/AppController.php:37
* @route '/api/apps'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/apps',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AppController::store
* @see app/Http/Controllers/AppController.php:37
* @route '/api/apps'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppController::store
* @see app/Http/Controllers/AppController.php:37
* @route '/api/apps'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AppController::store
* @see app/Http/Controllers/AppController.php:37
* @route '/api/apps'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AppController::store
* @see app/Http/Controllers/AppController.php:37
* @route '/api/apps'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AppController::show
* @see app/Http/Controllers/AppController.php:27
* @route '/api/apps/{app}'
*/
export const show = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/apps/{app}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AppController::show
* @see app/Http/Controllers/AppController.php:27
* @route '/api/apps/{app}'
*/
show.url = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { app: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { app: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            app: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        app: typeof args.app === 'object'
        ? args.app.id
        : args.app,
    }

    return show.definition.url
            .replace('{app}', parsedArgs.app.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppController::show
* @see app/Http/Controllers/AppController.php:27
* @route '/api/apps/{app}'
*/
show.get = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppController::show
* @see app/Http/Controllers/AppController.php:27
* @route '/api/apps/{app}'
*/
show.head = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AppController::show
* @see app/Http/Controllers/AppController.php:27
* @route '/api/apps/{app}'
*/
const showForm = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppController::show
* @see app/Http/Controllers/AppController.php:27
* @route '/api/apps/{app}'
*/
showForm.get = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppController::show
* @see app/Http/Controllers/AppController.php:27
* @route '/api/apps/{app}'
*/
showForm.head = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\AppController::update
* @see app/Http/Controllers/AppController.php:67
* @route '/api/apps/{app}'
*/
export const update = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/apps/{app}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AppController::update
* @see app/Http/Controllers/AppController.php:67
* @route '/api/apps/{app}'
*/
update.url = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { app: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { app: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            app: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        app: typeof args.app === 'object'
        ? args.app.id
        : args.app,
    }

    return update.definition.url
            .replace('{app}', parsedArgs.app.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppController::update
* @see app/Http/Controllers/AppController.php:67
* @route '/api/apps/{app}'
*/
update.put = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AppController::update
* @see app/Http/Controllers/AppController.php:67
* @route '/api/apps/{app}'
*/
const updateForm = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AppController::update
* @see app/Http/Controllers/AppController.php:67
* @route '/api/apps/{app}'
*/
updateForm.put = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\AppController::destroy
* @see app/Http/Controllers/AppController.php:93
* @route '/api/apps/{app}'
*/
export const destroy = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/apps/{app}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AppController::destroy
* @see app/Http/Controllers/AppController.php:93
* @route '/api/apps/{app}'
*/
destroy.url = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { app: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { app: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            app: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        app: typeof args.app === 'object'
        ? args.app.id
        : args.app,
    }

    return destroy.definition.url
            .replace('{app}', parsedArgs.app.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppController::destroy
* @see app/Http/Controllers/AppController.php:93
* @route '/api/apps/{app}'
*/
destroy.delete = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AppController::destroy
* @see app/Http/Controllers/AppController.php:93
* @route '/api/apps/{app}'
*/
const destroyForm = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AppController::destroy
* @see app/Http/Controllers/AppController.php:93
* @route '/api/apps/{app}'
*/
destroyForm.delete = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\AppController::updateStatus
* @see app/Http/Controllers/AppController.php:105
* @route '/api/apps/{app}/status'
*/
export const updateStatus = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/api/apps/{app}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AppController::updateStatus
* @see app/Http/Controllers/AppController.php:105
* @route '/api/apps/{app}/status'
*/
updateStatus.url = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { app: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { app: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            app: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        app: typeof args.app === 'object'
        ? args.app.id
        : args.app,
    }

    return updateStatus.definition.url
            .replace('{app}', parsedArgs.app.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppController::updateStatus
* @see app/Http/Controllers/AppController.php:105
* @route '/api/apps/{app}/status'
*/
updateStatus.post = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AppController::updateStatus
* @see app/Http/Controllers/AppController.php:105
* @route '/api/apps/{app}/status'
*/
const updateStatusForm = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AppController::updateStatus
* @see app/Http/Controllers/AppController.php:105
* @route '/api/apps/{app}/status'
*/
updateStatusForm.post = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.form = updateStatusForm

const AppController = { index, store, show, update, destroy, updateStatus }

export default AppController