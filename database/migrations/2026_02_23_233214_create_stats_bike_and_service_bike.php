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
        Schema::create('stat_bikes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bike_id')->constrained()->cascadeOnDelete();
            $table->float('distance')->default(0);
            $table->integer('rides')->default(0);
            $table->dateTime('last_service_date')->nullable();
            $table->timestamps();
        });

        Schema::create('service_bikes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stat_bike_id')
                ->unique()
                ->constrained('stat_bikes')
                ->cascadeOnDelete();
            $table->string('method')->default('manual');
            $table->float('interval_distance')->nullable();
            $table->integer('interval_time')->nullable();
            $table->integer('interval_rides')->nullable();
            $table->text('manual_note')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stat_bikes');
        Schema::dropIfExists('service_bikes');
    }
};
