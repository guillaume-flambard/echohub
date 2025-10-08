import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ServiceAccountController::index
* @see app/Http/Controllers/Api/ServiceAccountController.php:18
* @route '/api/service-accounts'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/service-accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::index
* @see app/Http/Controllers/Api/ServiceAccountController.php:18
* @route '/api/service-accounts'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::index
* @see app/Http/Controllers/Api/ServiceAccountController.php:18
* @route '/api/service-accounts'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::index
* @see app/Http/Controllers/Api/ServiceAccountController.php:18
* @route '/api/service-accounts'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::index
* @see app/Http/Controllers/Api/ServiceAccountController.php:18
* @route '/api/service-accounts'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::index
* @see app/Http/Controllers/Api/ServiceAccountController.php:18
* @route '/api/service-accounts'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::index
* @see app/Http/Controllers/Api/ServiceAccountController.php:18
* @route '/api/service-accounts'
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
* @see \App\Http\Controllers\Api\ServiceAccountController::store
* @see app/Http/Controllers/Api/ServiceAccountController.php:49
* @route '/api/service-accounts'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/service-accounts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::store
* @see app/Http/Controllers/Api/ServiceAccountController.php:49
* @route '/api/service-accounts'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::store
* @see app/Http/Controllers/Api/ServiceAccountController.php:49
* @route '/api/service-accounts'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::store
* @see app/Http/Controllers/Api/ServiceAccountController.php:49
* @route '/api/service-accounts'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::store
* @see app/Http/Controllers/Api/ServiceAccountController.php:49
* @route '/api/service-accounts'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::show
* @see app/Http/Controllers/Api/ServiceAccountController.php:79
* @route '/api/service-accounts/{serviceAccount}'
*/
export const show = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/service-accounts/{serviceAccount}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::show
* @see app/Http/Controllers/Api/ServiceAccountController.php:79
* @route '/api/service-accounts/{serviceAccount}'
*/
show.url = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { serviceAccount: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { serviceAccount: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            serviceAccount: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        serviceAccount: typeof args.serviceAccount === 'object'
        ? args.serviceAccount.id
        : args.serviceAccount,
    }

    return show.definition.url
            .replace('{serviceAccount}', parsedArgs.serviceAccount.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::show
* @see app/Http/Controllers/Api/ServiceAccountController.php:79
* @route '/api/service-accounts/{serviceAccount}'
*/
show.get = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::show
* @see app/Http/Controllers/Api/ServiceAccountController.php:79
* @route '/api/service-accounts/{serviceAccount}'
*/
show.head = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::show
* @see app/Http/Controllers/Api/ServiceAccountController.php:79
* @route '/api/service-accounts/{serviceAccount}'
*/
const showForm = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::show
* @see app/Http/Controllers/Api/ServiceAccountController.php:79
* @route '/api/service-accounts/{serviceAccount}'
*/
showForm.get = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::show
* @see app/Http/Controllers/Api/ServiceAccountController.php:79
* @route '/api/service-accounts/{serviceAccount}'
*/
showForm.head = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\ServiceAccountController::update
* @see app/Http/Controllers/Api/ServiceAccountController.php:90
* @route '/api/service-accounts/{serviceAccount}'
*/
export const update = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/service-accounts/{serviceAccount}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::update
* @see app/Http/Controllers/Api/ServiceAccountController.php:90
* @route '/api/service-accounts/{serviceAccount}'
*/
update.url = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { serviceAccount: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { serviceAccount: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            serviceAccount: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        serviceAccount: typeof args.serviceAccount === 'object'
        ? args.serviceAccount.id
        : args.serviceAccount,
    }

    return update.definition.url
            .replace('{serviceAccount}', parsedArgs.serviceAccount.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::update
* @see app/Http/Controllers/Api/ServiceAccountController.php:90
* @route '/api/service-accounts/{serviceAccount}'
*/
update.put = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::update
* @see app/Http/Controllers/Api/ServiceAccountController.php:90
* @route '/api/service-accounts/{serviceAccount}'
*/
const updateForm = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::update
* @see app/Http/Controllers/Api/ServiceAccountController.php:90
* @route '/api/service-accounts/{serviceAccount}'
*/
updateForm.put = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\ServiceAccountController::destroy
* @see app/Http/Controllers/Api/ServiceAccountController.php:112
* @route '/api/service-accounts/{serviceAccount}'
*/
export const destroy = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/service-accounts/{serviceAccount}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::destroy
* @see app/Http/Controllers/Api/ServiceAccountController.php:112
* @route '/api/service-accounts/{serviceAccount}'
*/
destroy.url = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { serviceAccount: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { serviceAccount: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            serviceAccount: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        serviceAccount: typeof args.serviceAccount === 'object'
        ? args.serviceAccount.id
        : args.serviceAccount,
    }

    return destroy.definition.url
            .replace('{serviceAccount}', parsedArgs.serviceAccount.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::destroy
* @see app/Http/Controllers/Api/ServiceAccountController.php:112
* @route '/api/service-accounts/{serviceAccount}'
*/
destroy.delete = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::destroy
* @see app/Http/Controllers/Api/ServiceAccountController.php:112
* @route '/api/service-accounts/{serviceAccount}'
*/
const destroyForm = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::destroy
* @see app/Http/Controllers/Api/ServiceAccountController.php:112
* @route '/api/service-accounts/{serviceAccount}'
*/
destroyForm.delete = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\ServiceAccountController::rotateKey
* @see app/Http/Controllers/Api/ServiceAccountController.php:125
* @route '/api/service-accounts/{serviceAccount}/rotate'
*/
export const rotateKey = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rotateKey.url(args, options),
    method: 'post',
})

rotateKey.definition = {
    methods: ["post"],
    url: '/api/service-accounts/{serviceAccount}/rotate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::rotateKey
* @see app/Http/Controllers/Api/ServiceAccountController.php:125
* @route '/api/service-accounts/{serviceAccount}/rotate'
*/
rotateKey.url = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { serviceAccount: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { serviceAccount: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            serviceAccount: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        serviceAccount: typeof args.serviceAccount === 'object'
        ? args.serviceAccount.id
        : args.serviceAccount,
    }

    return rotateKey.definition.url
            .replace('{serviceAccount}', parsedArgs.serviceAccount.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::rotateKey
* @see app/Http/Controllers/Api/ServiceAccountController.php:125
* @route '/api/service-accounts/{serviceAccount}/rotate'
*/
rotateKey.post = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rotateKey.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::rotateKey
* @see app/Http/Controllers/Api/ServiceAccountController.php:125
* @route '/api/service-accounts/{serviceAccount}/rotate'
*/
const rotateKeyForm = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rotateKey.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::rotateKey
* @see app/Http/Controllers/Api/ServiceAccountController.php:125
* @route '/api/service-accounts/{serviceAccount}/rotate'
*/
rotateKeyForm.post = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rotateKey.url(args, options),
    method: 'post',
})

rotateKey.form = rotateKeyForm

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::activate
* @see app/Http/Controllers/Api/ServiceAccountController.php:139
* @route '/api/service-accounts/{serviceAccount}/activate'
*/
export const activate = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(args, options),
    method: 'post',
})

activate.definition = {
    methods: ["post"],
    url: '/api/service-accounts/{serviceAccount}/activate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::activate
* @see app/Http/Controllers/Api/ServiceAccountController.php:139
* @route '/api/service-accounts/{serviceAccount}/activate'
*/
activate.url = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { serviceAccount: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { serviceAccount: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            serviceAccount: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        serviceAccount: typeof args.serviceAccount === 'object'
        ? args.serviceAccount.id
        : args.serviceAccount,
    }

    return activate.definition.url
            .replace('{serviceAccount}', parsedArgs.serviceAccount.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::activate
* @see app/Http/Controllers/Api/ServiceAccountController.php:139
* @route '/api/service-accounts/{serviceAccount}/activate'
*/
activate.post = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::activate
* @see app/Http/Controllers/Api/ServiceAccountController.php:139
* @route '/api/service-accounts/{serviceAccount}/activate'
*/
const activateForm = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: activate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::activate
* @see app/Http/Controllers/Api/ServiceAccountController.php:139
* @route '/api/service-accounts/{serviceAccount}/activate'
*/
activateForm.post = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: activate.url(args, options),
    method: 'post',
})

activate.form = activateForm

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::deactivate
* @see app/Http/Controllers/Api/ServiceAccountController.php:153
* @route '/api/service-accounts/{serviceAccount}/deactivate'
*/
export const deactivate = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deactivate.url(args, options),
    method: 'post',
})

deactivate.definition = {
    methods: ["post"],
    url: '/api/service-accounts/{serviceAccount}/deactivate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::deactivate
* @see app/Http/Controllers/Api/ServiceAccountController.php:153
* @route '/api/service-accounts/{serviceAccount}/deactivate'
*/
deactivate.url = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { serviceAccount: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { serviceAccount: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            serviceAccount: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        serviceAccount: typeof args.serviceAccount === 'object'
        ? args.serviceAccount.id
        : args.serviceAccount,
    }

    return deactivate.definition.url
            .replace('{serviceAccount}', parsedArgs.serviceAccount.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::deactivate
* @see app/Http/Controllers/Api/ServiceAccountController.php:153
* @route '/api/service-accounts/{serviceAccount}/deactivate'
*/
deactivate.post = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deactivate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::deactivate
* @see app/Http/Controllers/Api/ServiceAccountController.php:153
* @route '/api/service-accounts/{serviceAccount}/deactivate'
*/
const deactivateForm = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deactivate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ServiceAccountController::deactivate
* @see app/Http/Controllers/Api/ServiceAccountController.php:153
* @route '/api/service-accounts/{serviceAccount}/deactivate'
*/
deactivateForm.post = (args: { serviceAccount: number | { id: number } } | [serviceAccount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deactivate.url(args, options),
    method: 'post',
})

deactivate.form = deactivateForm

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

const ServiceAccountController = { index, store, show, update, destroy, rotateKey, activate, deactivate, verify }

export default ServiceAccountController