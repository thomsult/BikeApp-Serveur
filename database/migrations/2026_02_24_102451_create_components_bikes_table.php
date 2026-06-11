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
        Schema::create('type_components_bikes', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->timestamps();
        });
        Schema::create('brand_components_bikes', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->timestamps();
        });

        Schema::create('components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('type_id')->nullable()->constrained('type_components_bikes')->nullOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained('brand_components_bikes')->nullOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('model');
            $table->string('status');
            $table->boolean('multi_bike')->default(false);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('type_components_bikes');
        Schema::dropIfExists('brand_components_bikes');
        Schema::dropIfExists('components');
    }
};
