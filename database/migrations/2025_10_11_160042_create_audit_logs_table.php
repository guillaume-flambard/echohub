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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // Action details
            $table->string('action'); // created, updated, deleted, accessed, exported, etc.
            $table->string('resource_type'); // User, App, Contact, Message, Organization, etc.
            $table->unsignedBigInteger('resource_id')->nullable();
            $table->string('resource_name')->nullable(); // For display purposes

            // Change tracking
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();

            // Request context
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('request_method')->nullable(); // GET, POST, PUT, DELETE
            $table->string('request_url')->nullable();

            // Additional metadata
            $table->json('metadata')->nullable();
            $table->text('description')->nullable();

            // Risk level for security monitoring
            $table->string('severity')->default('info'); // info, warning, critical

            $table->timestamp('created_at')->useCurrent();

            // Indexes for efficient querying
            $table->index('organization_id');
            $table->index('user_id');
            $table->index(['resource_type', 'resource_id']);
            $table->index('action');
            $table->index('severity');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
