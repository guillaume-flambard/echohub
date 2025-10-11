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
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('logo_url')->nullable();

            // Subscription & billing
            $table->string('subscription_tier')->default('free'); // free, professional, business, enterprise
            $table->string('status')->default('trial'); // trial, active, suspended, cancelled
            $table->timestamp('trial_ends_at')->nullable();
            $table->string('stripe_customer_id')->nullable()->unique();
            $table->string('stripe_subscription_id')->nullable();

            // Tenant isolation (for database-per-tenant strategy)
            $table->string('database_name')->nullable();
            $table->string('database_host')->nullable();

            // Settings & configuration
            $table->json('settings')->nullable(); // branding, features, limits
            $table->json('metadata')->nullable(); // custom fields

            // Limits
            $table->integer('max_users')->default(5);
            $table->integer('max_apps')->default(3);
            $table->integer('max_messages_per_month')->default(1000);

            // Contact info
            $table->string('billing_email')->nullable();
            $table->string('support_email')->nullable();
            $table->string('phone')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('slug');
            $table->index('status');
            $table->index('subscription_tier');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
