import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Hub\PermissionController::index
* @see app/Http/Controllers/Hub/PermissionController.php:25
* @route '/hub/permissions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hub/permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\PermissionController::index
* @see app/Http/Controllers/Hub/PermissionController.php:25
* @route '/hub/permissions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\PermissionController::index
* @see app/Http/Controllers/Hub/PermissionController.php:25
* @route '/hub/permissions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::index
* @see app/Http/Controllers/Hub/PermissionController.php:25
* @route '/hub/permissions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::index
* @see app/Http/Controllers/Hub/PermissionController.php:25
* @route '/hub/permissions'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::index
* @see app/Http/Controllers/Hub/PermissionController.php:25
* @route '/hub/permissions'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::index
* @see app/Http/Controllers/Hub/PermissionController.php:25
* @route '/hub/permissions'
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
* @see \App\Http\Controllers\Hub\PermissionController::show
* @see app/Http/Controllers/Hub/PermissionController.php:37
* @route '/hub/permissions/{app}'
*/
export const show = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/hub/permissions/{app}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\PermissionController::show
* @see app/Http/Controllers/Hub/PermissionController.php:37
* @route '/hub/permissions/{app}'
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
* @see \App\Http\Controllers\Hub\PermissionController::show
* @see app/Http/Controllers/Hub/PermissionController.php:37
* @route '/hub/permissions/{app}'
*/
show.get = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::show
* @see app/Http/Controllers/Hub/PermissionController.php:37
* @route '/hub/permissions/{app}'
*/
show.head = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::show
* @see app/Http/Controllers/Hub/PermissionController.php:37
* @route '/hub/permissions/{app}'
*/
const showForm = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::show
* @see app/Http/Controllers/Hub/PermissionController.php:37
* @route '/hub/permissions/{app}'
*/
showForm.get = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::show
* @see app/Http/Controllers/Hub/PermissionController.php:37
* @route '/hub/permissions/{app}'
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
* @see \App\Http\Controllers\Hub\PermissionController::grant
* @see app/Http/Controllers/Hub/PermissionController.php:50
* @route '/hub/permissions/grant'
*/
export const grant = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: grant.url(options),
    method: 'post',
})

grant.definition = {
    methods: ["post"],
    url: '/hub/permissions/grant',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\PermissionController::grant
* @see app/Http/Controllers/Hub/PermissionController.php:50
* @route '/hub/permissions/grant'
*/
grant.url = (options?: RouteQueryOptions) => {
    return grant.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\PermissionController::grant
* @see app/Http/Controllers/Hub/PermissionController.php:50
* @route '/hub/permissions/grant'
*/
grant.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: grant.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::grant
* @see app/Http/Controllers/Hub/PermissionController.php:50
* @route '/hub/permissions/grant'
*/
const grantForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: grant.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::grant
* @see app/Http/Controllers/Hub/PermissionController.php:50
* @route '/hub/permissions/grant'
*/
grantForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: grant.url(options),
    method: 'post',
})

grant.form = grantForm

/**
* @see \App\Http\Controllers\Hub\PermissionController::revoke
* @see app/Http/Controllers/Hub/PermissionController.php:88
* @route '/hub/permissions/revoke'
*/
export const revoke = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revoke.url(options),
    method: 'post',
})

revoke.definition = {
    methods: ["post"],
    url: '/hub/permissions/revoke',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\PermissionController::revoke
* @see app/Http/Controllers/Hub/PermissionController.php:88
* @route '/hub/permissions/revoke'
*/
revoke.url = (options?: RouteQueryOptions) => {
    return revoke.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\PermissionController::revoke
* @see app/Http/Controllers/Hub/PermissionController.php:88
* @route '/hub/permissions/revoke'
*/
revoke.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revoke.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::revoke
* @see app/Http/Controllers/Hub/PermissionController.php:88
* @route '/hub/permissions/revoke'
*/
const revokeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revoke.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::revoke
* @see app/Http/Controllers/Hub/PermissionController.php:88
* @route '/hub/permissions/revoke'
*/
revokeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revoke.url(options),
    method: 'post',
})

revoke.form = revokeForm

/**
* @see \App\Http\Controllers\Hub\PermissionController::addScopes
* @see app/Http/Controllers/Hub/PermissionController.php:109
* @route '/hub/permissions/add-scopes'
*/
export const addScopes = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addScopes.url(options),
    method: 'post',
})

addScopes.definition = {
    methods: ["post"],
    url: '/hub/permissions/add-scopes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\PermissionController::addScopes
* @see app/Http/Controllers/Hub/PermissionController.php:109
* @route '/hub/permissions/add-scopes'
*/
addScopes.url = (options?: RouteQueryOptions) => {
    return addScopes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\PermissionController::addScopes
* @see app/Http/Controllers/Hub/PermissionController.php:109
* @route '/hub/permissions/add-scopes'
*/
addScopes.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addScopes.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::addScopes
* @see app/Http/Controllers/Hub/PermissionController.php:109
* @route '/hub/permissions/add-scopes'
*/
const addScopesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addScopes.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::addScopes
* @see app/Http/Controllers/Hub/PermissionController.php:109
* @route '/hub/permissions/add-scopes'
*/
addScopesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addScopes.url(options),
    method: 'post',
})

addScopes.form = addScopesForm

/**
* @see \App\Http\Controllers\Hub\PermissionController::removeScopes
* @see app/Http/Controllers/Hub/PermissionController.php:140
* @route '/hub/permissions/remove-scopes'
*/
export const removeScopes = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: removeScopes.url(options),
    method: 'post',
})

removeScopes.definition = {
    methods: ["post"],
    url: '/hub/permissions/remove-scopes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\PermissionController::removeScopes
* @see app/Http/Controllers/Hub/PermissionController.php:140
* @route '/hub/permissions/remove-scopes'
*/
removeScopes.url = (options?: RouteQueryOptions) => {
    return removeScopes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\PermissionController::removeScopes
* @see app/Http/Controllers/Hub/PermissionController.php:140
* @route '/hub/permissions/remove-scopes'
*/
removeScopes.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: removeScopes.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::removeScopes
* @see app/Http/Controllers/Hub/PermissionController.php:140
* @route '/hub/permissions/remove-scopes'
*/
const removeScopesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeScopes.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::removeScopes
* @see app/Http/Controllers/Hub/PermissionController.php:140
* @route '/hub/permissions/remove-scopes'
*/
removeScopesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeScopes.url(options),
    method: 'post',
})

removeScopes.form = removeScopesForm

/**
* @see \App\Http\Controllers\Hub\PermissionController::extend
* @see app/Http/Controllers/Hub/PermissionController.php:164
* @route '/hub/permissions/extend'
*/
export const extend = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extend.url(options),
    method: 'post',
})

extend.definition = {
    methods: ["post"],
    url: '/hub/permissions/extend',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\PermissionController::extend
* @see app/Http/Controllers/Hub/PermissionController.php:164
* @route '/hub/permissions/extend'
*/
extend.url = (options?: RouteQueryOptions) => {
    return extend.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\PermissionController::extend
* @see app/Http/Controllers/Hub/PermissionController.php:164
* @route '/hub/permissions/extend'
*/
extend.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: extend.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::extend
* @see app/Http/Controllers/Hub/PermissionController.php:164
* @route '/hub/permissions/extend'
*/
const extendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: extend.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::extend
* @see app/Http/Controllers/Hub/PermissionController.php:164
* @route '/hub/permissions/extend'
*/
extendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: extend.url(options),
    method: 'post',
})

extend.form = extendForm

/**
* @see \App\Http\Controllers\Hub\PermissionController::makePermanent
* @see app/Http/Controllers/Hub/PermissionController.php:188
* @route '/hub/permissions/make-permanent'
*/
export const makePermanent = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: makePermanent.url(options),
    method: 'post',
})

makePermanent.definition = {
    methods: ["post"],
    url: '/hub/permissions/make-permanent',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\PermissionController::makePermanent
* @see app/Http/Controllers/Hub/PermissionController.php:188
* @route '/hub/permissions/make-permanent'
*/
makePermanent.url = (options?: RouteQueryOptions) => {
    return makePermanent.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\PermissionController::makePermanent
* @see app/Http/Controllers/Hub/PermissionController.php:188
* @route '/hub/permissions/make-permanent'
*/
makePermanent.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: makePermanent.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::makePermanent
* @see app/Http/Controllers/Hub/PermissionController.php:188
* @route '/hub/permissions/make-permanent'
*/
const makePermanentForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: makePermanent.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::makePermanent
* @see app/Http/Controllers/Hub/PermissionController.php:188
* @route '/hub/permissions/make-permanent'
*/
makePermanentForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: makePermanent.url(options),
    method: 'post',
})

makePermanent.form = makePermanentForm

/**
* @see \App\Http\Controllers\Hub\PermissionController::bulkGrant
* @see app/Http/Controllers/Hub/PermissionController.php:210
* @route '/hub/permissions/bulk-grant'
*/
export const bulkGrant = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkGrant.url(options),
    method: 'post',
})

bulkGrant.definition = {
    methods: ["post"],
    url: '/hub/permissions/bulk-grant',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\PermissionController::bulkGrant
* @see app/Http/Controllers/Hub/PermissionController.php:210
* @route '/hub/permissions/bulk-grant'
*/
bulkGrant.url = (options?: RouteQueryOptions) => {
    return bulkGrant.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\PermissionController::bulkGrant
* @see app/Http/Controllers/Hub/PermissionController.php:210
* @route '/hub/permissions/bulk-grant'
*/
bulkGrant.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkGrant.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::bulkGrant
* @see app/Http/Controllers/Hub/PermissionController.php:210
* @route '/hub/permissions/bulk-grant'
*/
const bulkGrantForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkGrant.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::bulkGrant
* @see app/Http/Controllers/Hub/PermissionController.php:210
* @route '/hub/permissions/bulk-grant'
*/
bulkGrantForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkGrant.url(options),
    method: 'post',
})

bulkGrant.form = bulkGrantForm

/**
* @see \App\Http\Controllers\Hub\PermissionController::bulkRevoke
* @see app/Http/Controllers/Hub/PermissionController.php:241
* @route '/hub/permissions/bulk-revoke'
*/
export const bulkRevoke = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRevoke.url(options),
    method: 'post',
})

bulkRevoke.definition = {
    methods: ["post"],
    url: '/hub/permissions/bulk-revoke',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\PermissionController::bulkRevoke
* @see app/Http/Controllers/Hub/PermissionController.php:241
* @route '/hub/permissions/bulk-revoke'
*/
bulkRevoke.url = (options?: RouteQueryOptions) => {
    return bulkRevoke.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\PermissionController::bulkRevoke
* @see app/Http/Controllers/Hub/PermissionController.php:241
* @route '/hub/permissions/bulk-revoke'
*/
bulkRevoke.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRevoke.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::bulkRevoke
* @see app/Http/Controllers/Hub/PermissionController.php:241
* @route '/hub/permissions/bulk-revoke'
*/
const bulkRevokeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRevoke.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::bulkRevoke
* @see app/Http/Controllers/Hub/PermissionController.php:241
* @route '/hub/permissions/bulk-revoke'
*/
bulkRevokeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRevoke.url(options),
    method: 'post',
})

bulkRevoke.form = bulkRevokeForm

/**
* @see \App\Http\Controllers\Hub\PermissionController::appUsers
* @see app/Http/Controllers/Hub/PermissionController.php:262
* @route '/hub/permissions/app/{app}/users'
*/
export const appUsers = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: appUsers.url(args, options),
    method: 'get',
})

appUsers.definition = {
    methods: ["get","head"],
    url: '/hub/permissions/app/{app}/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\PermissionController::appUsers
* @see app/Http/Controllers/Hub/PermissionController.php:262
* @route '/hub/permissions/app/{app}/users'
*/
appUsers.url = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return appUsers.definition.url
            .replace('{app}', parsedArgs.app.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\PermissionController::appUsers
* @see app/Http/Controllers/Hub/PermissionController.php:262
* @route '/hub/permissions/app/{app}/users'
*/
appUsers.get = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: appUsers.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::appUsers
* @see app/Http/Controllers/Hub/PermissionController.php:262
* @route '/hub/permissions/app/{app}/users'
*/
appUsers.head = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: appUsers.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::appUsers
* @see app/Http/Controllers/Hub/PermissionController.php:262
* @route '/hub/permissions/app/{app}/users'
*/
const appUsersForm = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: appUsers.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::appUsers
* @see app/Http/Controllers/Hub/PermissionController.php:262
* @route '/hub/permissions/app/{app}/users'
*/
appUsersForm.get = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: appUsers.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::appUsers
* @see app/Http/Controllers/Hub/PermissionController.php:262
* @route '/hub/permissions/app/{app}/users'
*/
appUsersForm.head = (args: { app: number | { id: number } } | [app: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: appUsers.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

appUsers.form = appUsersForm

/**
* @see \App\Http\Controllers\Hub\PermissionController::userApps
* @see app/Http/Controllers/Hub/PermissionController.php:275
* @route '/hub/permissions/user/{user}/apps'
*/
export const userApps = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userApps.url(args, options),
    method: 'get',
})

userApps.definition = {
    methods: ["get","head"],
    url: '/hub/permissions/user/{user}/apps',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\PermissionController::userApps
* @see app/Http/Controllers/Hub/PermissionController.php:275
* @route '/hub/permissions/user/{user}/apps'
*/
userApps.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return userApps.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\PermissionController::userApps
* @see app/Http/Controllers/Hub/PermissionController.php:275
* @route '/hub/permissions/user/{user}/apps'
*/
userApps.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userApps.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::userApps
* @see app/Http/Controllers/Hub/PermissionController.php:275
* @route '/hub/permissions/user/{user}/apps'
*/
userApps.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: userApps.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::userApps
* @see app/Http/Controllers/Hub/PermissionController.php:275
* @route '/hub/permissions/user/{user}/apps'
*/
const userAppsForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userApps.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::userApps
* @see app/Http/Controllers/Hub/PermissionController.php:275
* @route '/hub/permissions/user/{user}/apps'
*/
userAppsForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userApps.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::userApps
* @see app/Http/Controllers/Hub/PermissionController.php:275
* @route '/hub/permissions/user/{user}/apps'
*/
userAppsForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userApps.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

userApps.form = userAppsForm

/**
* @see \App\Http\Controllers\Hub\PermissionController::expired
* @see app/Http/Controllers/Hub/PermissionController.php:288
* @route '/hub/permissions/expired'
*/
export const expired = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expired.url(options),
    method: 'get',
})

expired.definition = {
    methods: ["get","head"],
    url: '/hub/permissions/expired',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hub\PermissionController::expired
* @see app/Http/Controllers/Hub/PermissionController.php:288
* @route '/hub/permissions/expired'
*/
expired.url = (options?: RouteQueryOptions) => {
    return expired.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\PermissionController::expired
* @see app/Http/Controllers/Hub/PermissionController.php:288
* @route '/hub/permissions/expired'
*/
expired.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expired.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::expired
* @see app/Http/Controllers/Hub/PermissionController.php:288
* @route '/hub/permissions/expired'
*/
expired.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: expired.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::expired
* @see app/Http/Controllers/Hub/PermissionController.php:288
* @route '/hub/permissions/expired'
*/
const expiredForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: expired.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::expired
* @see app/Http/Controllers/Hub/PermissionController.php:288
* @route '/hub/permissions/expired'
*/
expiredForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: expired.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::expired
* @see app/Http/Controllers/Hub/PermissionController.php:288
* @route '/hub/permissions/expired'
*/
expiredForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: expired.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

expired.form = expiredForm

/**
* @see \App\Http\Controllers\Hub\PermissionController::cleanup
* @see app/Http/Controllers/Hub/PermissionController.php:301
* @route '/hub/permissions/cleanup'
*/
export const cleanup = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cleanup.url(options),
    method: 'post',
})

cleanup.definition = {
    methods: ["post"],
    url: '/hub/permissions/cleanup',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\PermissionController::cleanup
* @see app/Http/Controllers/Hub/PermissionController.php:301
* @route '/hub/permissions/cleanup'
*/
cleanup.url = (options?: RouteQueryOptions) => {
    return cleanup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\PermissionController::cleanup
* @see app/Http/Controllers/Hub/PermissionController.php:301
* @route '/hub/permissions/cleanup'
*/
cleanup.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cleanup.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::cleanup
* @see app/Http/Controllers/Hub/PermissionController.php:301
* @route '/hub/permissions/cleanup'
*/
const cleanupForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cleanup.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Hub\PermissionController::cleanup
* @see app/Http/Controllers/Hub/PermissionController.php:301
* @route '/hub/permissions/cleanup'
*/
cleanupForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cleanup.url(options),
    method: 'post',
})

cleanup.form = cleanupForm

const permissions = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    grant: Object.assign(grant, grant),
    revoke: Object.assign(revoke, revoke),
    addScopes: Object.assign(addScopes, addScopes),
    removeScopes: Object.assign(removeScopes, removeScopes),
    extend: Object.assign(extend, extend),
    makePermanent: Object.assign(makePermanent, makePermanent),
    bulkGrant: Object.assign(bulkGrant, bulkGrant),
    bulkRevoke: Object.assign(bulkRevoke, bulkRevoke),
    appUsers: Object.assign(appUsers, appUsers),
    userApps: Object.assign(userApps, userApps),
    expired: Object.assign(expired, expired),
    cleanup: Object.assign(cleanup, cleanup),
}

export default permissions