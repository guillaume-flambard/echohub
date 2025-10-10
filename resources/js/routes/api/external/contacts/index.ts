import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ExternalApiController::index
* @see app/Http/Controllers/Api/ExternalApiController.php:74
* @route '/api/external/users/{user}/contacts'
*/
export const index = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/external/users/{user}/contacts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExternalApiController::index
* @see app/Http/Controllers/Api/ExternalApiController.php:74
* @route '/api/external/users/{user}/contacts'
*/
index.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return index.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExternalApiController::index
* @see app/Http/Controllers/Api/ExternalApiController.php:74
* @route '/api/external/users/{user}/contacts'
*/
index.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::index
* @see app/Http/Controllers/Api/ExternalApiController.php:74
* @route '/api/external/users/{user}/contacts'
*/
index.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::index
* @see app/Http/Controllers/Api/ExternalApiController.php:74
* @route '/api/external/users/{user}/contacts'
*/
const indexForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::index
* @see app/Http/Controllers/Api/ExternalApiController.php:74
* @route '/api/external/users/{user}/contacts'
*/
indexForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::index
* @see app/Http/Controllers/Api/ExternalApiController.php:74
* @route '/api/external/users/{user}/contacts'
*/
indexForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Api\ExternalApiController::store
* @see app/Http/Controllers/Api/ExternalApiController.php:98
* @route '/api/external/users/{user}/contacts'
*/
export const store = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/external/users/{user}/contacts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ExternalApiController::store
* @see app/Http/Controllers/Api/ExternalApiController.php:98
* @route '/api/external/users/{user}/contacts'
*/
store.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return store.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExternalApiController::store
* @see app/Http/Controllers/Api/ExternalApiController.php:98
* @route '/api/external/users/{user}/contacts'
*/
store.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::store
* @see app/Http/Controllers/Api/ExternalApiController.php:98
* @route '/api/external/users/{user}/contacts'
*/
const storeForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::store
* @see app/Http/Controllers/Api/ExternalApiController.php:98
* @route '/api/external/users/{user}/contacts'
*/
storeForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\ExternalApiController::destroy
* @see app/Http/Controllers/Api/ExternalApiController.php:128
* @route '/api/external/users/{user}/contacts/{contact}'
*/
export const destroy = (args: { user: number | { id: number }, contact: number | { id: number } } | [user: number | { id: number }, contact: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/external/users/{user}/contacts/{contact}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\ExternalApiController::destroy
* @see app/Http/Controllers/Api/ExternalApiController.php:128
* @route '/api/external/users/{user}/contacts/{contact}'
*/
destroy.url = (args: { user: number | { id: number }, contact: number | { id: number } } | [user: number | { id: number }, contact: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            user: args[0],
            contact: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
        contact: typeof args.contact === 'object'
        ? args.contact.id
        : args.contact,
    }

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{contact}', parsedArgs.contact.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExternalApiController::destroy
* @see app/Http/Controllers/Api/ExternalApiController.php:128
* @route '/api/external/users/{user}/contacts/{contact}'
*/
destroy.delete = (args: { user: number | { id: number }, contact: number | { id: number } } | [user: number | { id: number }, contact: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::destroy
* @see app/Http/Controllers/Api/ExternalApiController.php:128
* @route '/api/external/users/{user}/contacts/{contact}'
*/
const destroyForm = (args: { user: number | { id: number }, contact: number | { id: number } } | [user: number | { id: number }, contact: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::destroy
* @see app/Http/Controllers/Api/ExternalApiController.php:128
* @route '/api/external/users/{user}/contacts/{contact}'
*/
destroyForm.delete = (args: { user: number | { id: number }, contact: number | { id: number } } | [user: number | { id: number }, contact: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const contacts = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default contacts