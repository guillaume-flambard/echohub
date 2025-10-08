import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Hub\AppManagementController::index
* @see app/Http/Controllers/Hub/AppManagementController.php:25
* @route '/hub/apps'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hub/apps',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\AppManagementController::index
* @see app/Http/Controllers/Hub/AppManagementController.php:25
* @route '/hub/apps'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\AppManagementController::index
* @see app/Http/Controllers/Hub/AppManagementController.php:25
* @route '/hub/apps'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::index
* @see app/Http/Controllers/Hub/AppManagementController.php:25
* @route '/hub/apps'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::index
* @see app/Http/Controllers/Hub/AppManagementController.php:25
* @route '/hub/apps'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::index
* @see app/Http/Controllers/Hub/AppManagementController.php:25
* @route '/hub/apps'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::index
* @see app/Http/Controllers/Hub/AppManagementController.php:25
* @route '/hub/apps'
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
* @see \App\Http\Controllers\Hub\AppManagementController::create
* @see app/Http/Controllers/Hub/AppManagementController.php:53
* @route '/hub/apps/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/hub/apps/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\AppManagementController::create
* @see app/Http/Controllers/Hub/AppManagementController.php:53
* @route '/hub/apps/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\AppManagementController::create
* @see app/Http/Controllers/Hub/AppManagementController.php:53
* @route '/hub/apps/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::create
* @see app/Http/Controllers/Hub/AppManagementController.php:53
* @route '/hub/apps/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::create
* @see app/Http/Controllers/Hub/AppManagementController.php:53
* @route '/hub/apps/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::create
* @see app/Http/Controllers/Hub/AppManagementController.php:53
* @route '/hub/apps/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::create
* @see app/Http/Controllers/Hub/AppManagementController.php:53
* @route '/hub/apps/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\Hub\AppManagementController::store
* @see app/Http/Controllers/Hub/AppManagementController.php:61
* @route '/hub/apps'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hub/apps',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\AppManagementController::store
* @see app/Http/Controllers/Hub/AppManagementController.php:61
* @route '/hub/apps'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\AppManagementController::store
* @see app/Http/Controllers/Hub/AppManagementController.php:61
* @route '/hub/apps'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::store
* @see app/Http/Controllers/Hub/AppManagementController.php:61
* @route '/hub/apps'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::store
* @see app/Http/Controllers/Hub/AppManagementController.php:61
* @route '/hub/apps'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Hub\AppManagementController::show
* @see app/Http/Controllers/Hub/AppManagementController.php:39
* @route '/hub/apps/{app}'
*/
export const show = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/hub/apps/{app}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\AppManagementController::show
* @see app/Http/Controllers/Hub/AppManagementController.php:39
* @route '/hub/apps/{app}'
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
* @see \App\Http\Controllers\Hub\AppManagementController::show
* @see app/Http/Controllers/Hub/AppManagementController.php:39
* @route '/hub/apps/{app}'
*/
show.get = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::show
* @see app/Http/Controllers/Hub/AppManagementController.php:39
* @route '/hub/apps/{app}'
*/
show.head = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::show
* @see app/Http/Controllers/Hub/AppManagementController.php:39
* @route '/hub/apps/{app}'
*/
const showForm = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::show
* @see app/Http/Controllers/Hub/AppManagementController.php:39
* @route '/hub/apps/{app}'
*/
showForm.get = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::show
* @see app/Http/Controllers/Hub/AppManagementController.php:39
* @route '/hub/apps/{app}'
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
* @see \App\Http\Controllers\Hub\AppManagementController::edit
* @see app/Http/Controllers/Hub/AppManagementController.php:95
* @route '/hub/apps/{app}/edit'
*/
export const edit = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/hub/apps/{app}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\AppManagementController::edit
* @see app/Http/Controllers/Hub/AppManagementController.php:95
* @route '/hub/apps/{app}/edit'
*/
edit.url = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{app}', parsedArgs.app.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\AppManagementController::edit
* @see app/Http/Controllers/Hub/AppManagementController.php:95
* @route '/hub/apps/{app}/edit'
*/
edit.get = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::edit
* @see app/Http/Controllers/Hub/AppManagementController.php:95
* @route '/hub/apps/{app}/edit'
*/
edit.head = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::edit
* @see app/Http/Controllers/Hub/AppManagementController.php:95
* @route '/hub/apps/{app}/edit'
*/
const editForm = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::edit
* @see app/Http/Controllers/Hub/AppManagementController.php:95
* @route '/hub/apps/{app}/edit'
*/
editForm.get = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::edit
* @see app/Http/Controllers/Hub/AppManagementController.php:95
* @route '/hub/apps/{app}/edit'
*/
editForm.head = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Hub\AppManagementController::update
* @see app/Http/Controllers/Hub/AppManagementController.php:105
* @route '/hub/apps/{app}'
*/
export const update = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/hub/apps/{app}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Hub\AppManagementController::update
* @see app/Http/Controllers/Hub/AppManagementController.php:105
* @route '/hub/apps/{app}'
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
* @see \App\Http\Controllers\Hub\AppManagementController::update
* @see app/Http/Controllers/Hub/AppManagementController.php:105
* @route '/hub/apps/{app}'
*/
update.put = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::update
* @see app/Http/Controllers/Hub/AppManagementController.php:105
* @route '/hub/apps/{app}'
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
* @see \App\Http\Controllers\Hub\AppManagementController::update
* @see app/Http/Controllers/Hub/AppManagementController.php:105
* @route '/hub/apps/{app}'
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
* @see \App\Http\Controllers\Hub\AppManagementController::destroy
* @see app/Http/Controllers/Hub/AppManagementController.php:133
* @route '/hub/apps/{app}'
*/
export const destroy = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/hub/apps/{app}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Hub\AppManagementController::destroy
* @see app/Http/Controllers/Hub/AppManagementController.php:133
* @route '/hub/apps/{app}'
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
* @see \App\Http\Controllers\Hub\AppManagementController::destroy
* @see app/Http/Controllers/Hub/AppManagementController.php:133
* @route '/hub/apps/{app}'
*/
destroy.delete = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::destroy
* @see app/Http/Controllers/Hub/AppManagementController.php:133
* @route '/hub/apps/{app}'
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
* @see \App\Http\Controllers\Hub\AppManagementController::destroy
* @see app/Http/Controllers/Hub/AppManagementController.php:133
* @route '/hub/apps/{app}'
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
* @see \App\Http\Controllers\Hub\AppManagementController::testConnection
* @see app/Http/Controllers/Hub/AppManagementController.php:144
* @route '/hub/apps/{app}/test-connection'
*/
export const testConnection = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testConnection.url(args, options),
    method: 'post',
})

testConnection.definition = {
    methods: ["post"],
    url: '/hub/apps/{app}/test-connection',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\AppManagementController::testConnection
* @see app/Http/Controllers/Hub/AppManagementController.php:144
* @route '/hub/apps/{app}/test-connection'
*/
testConnection.url = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return testConnection.definition.url
            .replace('{app}', parsedArgs.app.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\AppManagementController::testConnection
* @see app/Http/Controllers/Hub/AppManagementController.php:144
* @route '/hub/apps/{app}/test-connection'
*/
testConnection.post = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testConnection.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::testConnection
* @see app/Http/Controllers/Hub/AppManagementController.php:144
* @route '/hub/apps/{app}/test-connection'
*/
const testConnectionForm = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: testConnection.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::testConnection
* @see app/Http/Controllers/Hub/AppManagementController.php:144
* @route '/hub/apps/{app}/test-connection'
*/
testConnectionForm.post = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: testConnection.url(args, options),
    method: 'post',
})

testConnection.form = testConnectionForm

/**
* @see \App\Http\Controllers\Hub\AppManagementController::syncMetadata
* @see app/Http/Controllers/Hub/AppManagementController.php:159
* @route '/hub/apps/{app}/sync-metadata'
*/
export const syncMetadata = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncMetadata.url(args, options),
    method: 'post',
})

syncMetadata.definition = {
    methods: ["post"],
    url: '/hub/apps/{app}/sync-metadata',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\AppManagementController::syncMetadata
* @see app/Http/Controllers/Hub/AppManagementController.php:159
* @route '/hub/apps/{app}/sync-metadata'
*/
syncMetadata.url = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return syncMetadata.definition.url
            .replace('{app}', parsedArgs.app.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\AppManagementController::syncMetadata
* @see app/Http/Controllers/Hub/AppManagementController.php:159
* @route '/hub/apps/{app}/sync-metadata'
*/
syncMetadata.post = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncMetadata.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::syncMetadata
* @see app/Http/Controllers/Hub/AppManagementController.php:159
* @route '/hub/apps/{app}/sync-metadata'
*/
const syncMetadataForm = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncMetadata.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::syncMetadata
* @see app/Http/Controllers/Hub/AppManagementController.php:159
* @route '/hub/apps/{app}/sync-metadata'
*/
syncMetadataForm.post = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: syncMetadata.url(args, options),
    method: 'post',
})

syncMetadata.form = syncMetadataForm

/**
* @see \App\Http\Controllers\Hub\AppManagementController::stats
* @see app/Http/Controllers/Hub/AppManagementController.php:173
* @route '/hub/apps/{app}/stats'
*/
export const stats = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(args, options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/hub/apps/{app}/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\AppManagementController::stats
* @see app/Http/Controllers/Hub/AppManagementController.php:173
* @route '/hub/apps/{app}/stats'
*/
stats.url = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return stats.definition.url
            .replace('{app}', parsedArgs.app.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\AppManagementController::stats
* @see app/Http/Controllers/Hub/AppManagementController.php:173
* @route '/hub/apps/{app}/stats'
*/
stats.get = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::stats
* @see app/Http/Controllers/Hub/AppManagementController.php:173
* @route '/hub/apps/{app}/stats'
*/
stats.head = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::stats
* @see app/Http/Controllers/Hub/AppManagementController.php:173
* @route '/hub/apps/{app}/stats'
*/
const statsForm = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::stats
* @see app/Http/Controllers/Hub/AppManagementController.php:173
* @route '/hub/apps/{app}/stats'
*/
statsForm.get = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::stats
* @see app/Http/Controllers/Hub/AppManagementController.php:173
* @route '/hub/apps/{app}/stats'
*/
statsForm.head = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

stats.form = statsForm

/**
* @see \App\Http\Controllers\Hub\AppManagementController::activity
* @see app/Http/Controllers/Hub/AppManagementController.php:194
* @route '/hub/apps/{app}/activity'
*/
export const activity = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activity.url(args, options),
    method: 'get',
})

activity.definition = {
    methods: ["get","head"],
    url: '/hub/apps/{app}/activity',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\AppManagementController::activity
* @see app/Http/Controllers/Hub/AppManagementController.php:194
* @route '/hub/apps/{app}/activity'
*/
activity.url = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return activity.definition.url
            .replace('{app}', parsedArgs.app.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\AppManagementController::activity
* @see app/Http/Controllers/Hub/AppManagementController.php:194
* @route '/hub/apps/{app}/activity'
*/
activity.get = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activity.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::activity
* @see app/Http/Controllers/Hub/AppManagementController.php:194
* @route '/hub/apps/{app}/activity'
*/
activity.head = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: activity.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::activity
* @see app/Http/Controllers/Hub/AppManagementController.php:194
* @route '/hub/apps/{app}/activity'
*/
const activityForm = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: activity.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::activity
* @see app/Http/Controllers/Hub/AppManagementController.php:194
* @route '/hub/apps/{app}/activity'
*/
activityForm.get = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: activity.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\AppManagementController::activity
* @see app/Http/Controllers/Hub/AppManagementController.php:194
* @route '/hub/apps/{app}/activity'
*/
activityForm.head = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: activity.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

activity.form = activityForm

const apps = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    testConnection: Object.assign(testConnection, testConnection),
    syncMetadata: Object.assign(syncMetadata, syncMetadata),
    stats: Object.assign(stats, stats),
    activity: Object.assign(activity, activity),
}

export default apps