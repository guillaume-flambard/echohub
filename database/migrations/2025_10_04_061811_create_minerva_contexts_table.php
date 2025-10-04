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
        Schema::create('minerva_contexts', function (Blueprint $table) {
            $table->id();
            $table->string('instance_id'); // Matrix user ID of the app bot
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->json('conversation_history')->nullable(); // Array of messages
            $table->json('app_state')->nullable(); // App-specific state data
            $table->timestamps();

            $table->unique(['instance_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('minerva_contexts');
    }
};
