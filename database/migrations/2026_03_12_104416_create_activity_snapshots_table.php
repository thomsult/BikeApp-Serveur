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
        Schema::create('activity_snapshots', function (Blueprint $table) {
            $table->id();
            $table->string('original_id')->index();
            $table->string('token', 12)->unique();
            $table->foreignId('original_owner_id')->constrained('users')->onDelete('cascade');
            $table->json('data');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_snapshots');
    }
};
