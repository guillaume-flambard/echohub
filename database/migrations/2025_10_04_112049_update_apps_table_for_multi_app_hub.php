<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('apps', function (Blueprint $table) {
            $table->string('app_url')->nullable()->after('domain');
            $table->text('service_api_key')->nullable()->after('app_url');
            $table->json('available_scopes')->nullable()->after('capabilities');
            $table->text('description')->nullable()->after('metadata');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('apps', function (Blueprint $table) {
            $table->dropColumn(['app_url', 'service_api_key', 'available_scopes', 'description']);
        });
    }
};
