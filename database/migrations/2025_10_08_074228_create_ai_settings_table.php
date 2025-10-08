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
        Schema::create('ai_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('provider')->default('ollama'); // ollama, openai, anthropic
            $table->string('model')->default('llama3.2:3b');
            $table->text('api_key')->nullable(); // encrypted
            $table->string('base_url')->default('http://localhost:11434');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Only one active setting per user (or global if user_id is null)
            $table->unique(['user_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_settings');
    }
};
