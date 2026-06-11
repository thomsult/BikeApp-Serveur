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
        Schema::create('rides', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('distance', 8, 2);
            $table->integer('duration'); // en secondes
            $table->decimal('average_speed', 5, 2)->nullable();
            $table->decimal('max_speed', 5, 2)->nullable();
            $table->string('image_url')->nullable();
            $table->text('memo')->nullable();
            $table->timestamp('started_at');
            $table->timestamp('end_at')->nullable();
            $table->json('waypoints')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rides');
    }
};
