import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Api\ExternalApiController::getUsers
* @see app/Http/Controllers/Api/ExternalApiController.php:37
* @route '/api/external/users'
*/
export const getUsers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUsers.url(options),
    method: 'get',
})

getUsers.definition = {
    methods: ["get","head"],
    url: '/api/external/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUsers
* @see app/Http/Controllers/Api/ExternalApiController.php:37
* @route '/api/external/users'
*/
getUsers.url = (options?: RouteQueryOptions) => {
    return getUsers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUsers
* @see app/Http/Controllers/Api/ExternalApiController.php:37
* @route '/api/external/users'
*/
getUsers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUsers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUsers
* @see app/Http/Controllers/Api/ExternalApiController.php:37
* @route '/api/external/users'
*/
getUsers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getUsers.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUsers
* @see app/Http/Controllers/Api/ExternalApiController.php:37
* @route '/api/external/users'
*/
const getUsersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUsers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUsers
* @see app/Http/Controllers/Api/ExternalApiController.php:37
* @route '/api/external/users'
*/
getUsersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUsers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUsers
* @see app/Http/Controllers/Api/ExternalApiController.php:37
* @route '/api/external/users'
*/
getUsersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUsers.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getUsers.form = getUsersForm

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUser
* @see app/Http/Controllers/Api/ExternalApiController.php:19
* @route '/api/external/users/{user}'
*/
export const getUser = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUser.url(args, options),
    method: 'get',
})

getUser.definition = {
    methods: ["get","head"],
    url: '/api/external/users/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUser
* @see app/Http/Controllers/Api/ExternalApiController.php:19
* @route '/api/external/users/{user}'
*/
getUser.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return getUser.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUser
* @see app/Http/Controllers/Api/ExternalApiController.php:19
* @route '/api/external/users/{user}'
*/
getUser.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUser.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUser
* @see app/Http/Controllers/Api/ExternalApiController.php:19
* @route '/api/external/users/{user}'
*/
getUser.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getUser.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUser
* @see app/Http/Controllers/Api/ExternalApiController.php:19
* @route '/api/external/users/{user}'
*/
const getUserForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUser.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUser
* @see app/Http/Controllers/Api/ExternalApiController.php:19
* @route '/api/external/users/{user}'
*/
getUserForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUser.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUser
* @see app/Http/Controllers/Api/ExternalApiController.php:19
* @route '/api/external/users/{user}'
*/
getUserForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUser.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getUser.form = getUserForm

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUserContacts
* @see app/Http/Controllers/Api/ExternalApiController.php:74
* @route '/api/external/users/{user}/contacts'
*/
export const getUserContacts = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUserContacts.url(args, options),
    method: 'get',
})

getUserContacts.definition = {
    methods: ["get","head"],
    url: '/api/external/users/{user}/contacts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUserContacts
* @see app/Http/Controllers/Api/ExternalApiController.php:74
* @route '/api/external/users/{user}/contacts'
*/
getUserContacts.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return getUserContacts.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUserContacts
* @see app/Http/Controllers/Api/ExternalApiController.php:74
* @route '/api/external/users/{user}/contacts'
*/
getUserContacts.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUserContacts.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUserContacts
* @see app/Http/Controllers/Api/ExternalApiController.php:74
* @route '/api/external/users/{user}/contacts'
*/
getUserContacts.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getUserContacts.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUserContacts
* @see app/Http/Controllers/Api/ExternalApiController.php:74
* @route '/api/external/users/{user}/contacts'
*/
const getUserContactsForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUserContacts.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUserContacts
* @see app/Http/Controllers/Api/ExternalApiController.php:74
* @route '/api/external/users/{user}/contacts'
*/
getUserContactsForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUserContacts.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::getUserContacts
* @see app/Http/Controllers/Api/ExternalApiController.php:74
* @route '/api/external/users/{user}/contacts'
*/
getUserContactsForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUserContacts.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getUserContacts.form = getUserContactsForm

/**
* @see \App\Http\Controllers\Api\ExternalApiController::createUserContact
* @see app/Http/Controllers/Api/ExternalApiController.php:98
* @route '/api/external/users/{user}/contacts'
*/
export const createUserContact = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createUserContact.url(args, options),
    method: 'post',
})

createUserContact.definition = {
    methods: ["post"],
    url: '/api/external/users/{user}/contacts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ExternalApiController::createUserContact
* @see app/Http/Controllers/Api/ExternalApiController.php:98
* @route '/api/external/users/{user}/contacts'
*/
createUserContact.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return createUserContact.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExternalApiController::createUserContact
* @see app/Http/Controllers/Api/ExternalApiController.php:98
* @route '/api/external/users/{user}/contacts'
*/
createUserContact.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createUserContact.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::createUserContact
* @see app/Http/Controllers/Api/ExternalApiController.php:98
* @route '/api/external/users/{user}/contacts'
*/
const createUserContactForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createUserContact.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::createUserContact
* @see app/Http/Controllers/Api/ExternalApiController.php:98
* @route '/api/external/users/{user}/contacts'
*/
createUserContactForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createUserContact.url(args, options),
    method: 'post',
})

createUserContact.form = createUserContactForm

/**
* @see \App\Http\Controllers\Api\ExternalApiController::deleteUserContact
* @see app/Http/Controllers/Api/ExternalApiController.php:128
* @route '/api/external/users/{user}/contacts/{contact}'
*/
export const deleteUserContact = (args: { user: number | { id: number }, contact: number | { id: number } } | [user: number | { id: number }, contact: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteUserContact.url(args, options),
    method: 'delete',
})

deleteUserContact.definition = {
    methods: ["delete"],
    url: '/api/external/users/{user}/contacts/{contact}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\ExternalApiController::deleteUserContact
* @see app/Http/Controllers/Api/ExternalApiController.php:128
* @route '/api/external/users/{user}/contacts/{contact}'
*/
deleteUserContact.url = (args: { user: number | { id: number }, contact: number | { id: number } } | [user: number | { id: number }, contact: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return deleteUserContact.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{contact}', parsedArgs.contact.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ExternalApiController::deleteUserContact
* @see app/Http/Controllers/Api/ExternalApiController.php:128
* @route '/api/external/users/{user}/contacts/{contact}'
*/
deleteUserContact.delete = (args: { user: number | { id: number }, contact: number | { id: number } } | [user: number | { id: number }, contact: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteUserContact.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::deleteUserContact
* @see app/Http/Controllers/Api/ExternalApiController.php:128
* @route '/api/external/users/{user}/contacts/{contact}'
*/
const deleteUserContactForm = (args: { user: number | { id: number }, contact: number | { id: number } } | [user: number | { id: number }, contact: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteUserContact.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ExternalApiController::deleteUserContact
* @see app/Http/Controllers/Api/ExternalApiController.php:128
* @route '/api/external/users/{user}/contacts/{contact}'
*/
deleteUserContactForm.delete = (args: { user: number | { id: number }, contact: number | { id: number } } | [user: number | { id: number }, contact: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteUserContact.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteUserContact.form = deleteUserContactForm

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

const ExternalApiController = { health, metadata, getUsers, getUser, getUserContacts, createUserContact, deleteUserContact, search }

export default ExternalApiController