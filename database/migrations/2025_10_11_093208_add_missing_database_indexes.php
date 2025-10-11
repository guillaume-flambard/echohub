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
        Schema::table('contacts', function (Blueprint $table) {
            // Composite index for frequent user+type queries
            $table->index(['user_id', 'type'], 'contacts_user_id_type_index');

            // Index for app relationship joins (only if column exists)
            if (Schema::hasColumn('contacts', 'app_id')) {
                $table->index('app_id', 'contacts_app_id_index');
            }
        });

        Schema::table('minerva_contexts', function (Blueprint $table) {
            // Composite index for recent activity queries
            $table->index(['user_id', 'updated_at'], 'minerva_contexts_user_id_updated_at_index');

            // Index for instance lookups
            $table->index('instance_id', 'minerva_contexts_instance_id_index');
        });

        Schema::table('apps', function (Blueprint $table) {
            // Index for status filtering (online/offline)
            $table->index('status', 'apps_status_index');

            // Index for Matrix user lookups
            $table->index('matrix_user_id', 'apps_matrix_user_id_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropIndex('contacts_user_id_type_index');
            // Only drop app_id index if it exists
            if (Schema::hasColumn('contacts', 'app_id')) {
                $table->dropIndex('contacts_app_id_index');
            }
        });

        Schema::table('minerva_contexts', function (Blueprint $table) {
            $table->dropIndex('minerva_contexts_user_id_updated_at_index');
            $table->dropIndex('minerva_contexts_instance_id_index');
        });

        Schema::table('apps', function (Blueprint $table) {
            $table->dropIndex('apps_status_index');
            $table->dropIndex('apps_matrix_user_id_index');
        });
    }
};
