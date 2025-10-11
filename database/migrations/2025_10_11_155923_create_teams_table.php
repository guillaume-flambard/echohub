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
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();

            // Settings
            $table->json('settings')->nullable();
            $table->json('metadata')->nullable();

            // Quotas (optional per-team limits)
            $table->integer('max_members')->nullable();
            $table->integer('max_apps')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Composite unique constraint
            $table->unique(['organization_id', 'slug']);

            // Indexes
            $table->index('organization_id');
            $table->index('owner_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
