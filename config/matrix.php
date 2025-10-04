<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Matrix Homeserver URL
    |--------------------------------------------------------------------------
    |
    | The URL of your Matrix homeserver
    |
    */

    'homeserver_url' => env('MATRIX_HOMESERVER_URL', 'http://localhost:8008'),

    /*
    |--------------------------------------------------------------------------
    | Matrix Server Name
    |--------------------------------------------------------------------------
    |
    | The server name for your Matrix instance
    |
    */

    'server_name' => env('MATRIX_SERVER_NAME', 'echohub.local'),

    /*
    |--------------------------------------------------------------------------
    | Matrix Admin Credentials
    |--------------------------------------------------------------------------
    |
    | Credentials for Matrix admin user (for bot provisioning)
    |
    */

    'admin_user' => env('MATRIX_ADMIN_USER', 'admin'),
    'admin_password' => env('MATRIX_ADMIN_PASSWORD'),

    /*
    |--------------------------------------------------------------------------
    | Application Service Tokens
    |--------------------------------------------------------------------------
    |
    | Tokens for Matrix Application Service integration
    |
    */

    'as_token' => env('MATRIX_AS_TOKEN'),
    'hs_token' => env('MATRIX_HS_TOKEN'),

];
