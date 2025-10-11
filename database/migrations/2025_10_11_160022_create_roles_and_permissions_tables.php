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
        // Permissions table
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., 'users.create', 'apps.delete'
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->string('category')->nullable(); // users, apps, settings, etc.
            $table->timestamps();

            $table->index('category');
        });

        // Roles table
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->boolean('is_system')->default(false); // System roles cannot be deleted
            $table->json('permissions')->nullable(); // Array of permission IDs
            $table->timestamps();

            // Unique constraint: name must be unique within organization (or global if null)
            $table->unique(['organization_id', 'name']);

            $table->index('organization_id');
            $table->index('is_system');
        });

        // Permission-Role pivot (optional, for more flexible permission management)
        Schema::create('permission_role', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['permission_id', 'role_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('permissions');
    }
};
