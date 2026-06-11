<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->integer('version')->default(1);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('type_id')->nullable()->constrained('type_activities')->onDelete('set null');

            // Champs communs
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('recurrence_frequency', ['daily', 'weekly', 'monthly', 'yearly', 'manually', 'none'])->default('none');
            $table->integer('recurrence_interval')->nullable();
            $table->datetime('dt_start');
            $table->datetime('dt_end')->nullable();
            $table->string('location')->nullable();
            $table->text('notes')->nullable();
            $table->datetime('completed_at')->nullable();

            // Ride
            $table->float('distance')->nullable();
            $table->integer('duration')->nullable();
            $table->string('bike_id')->nullable();
            $table->datetime('started_at')->nullable();
            $table->datetime('stopped_at')->nullable();

            // Training
            $table->enum('training_type', ['interval', 'endurance', 'tempo', 'recovery'])->nullable();

            // Maintenance
            $table->string('equipment_id')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
