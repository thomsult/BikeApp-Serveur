<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('type_activities', function (Blueprint $table) {
            $table->id();

            $table->string('label');
            $table->enum('family', [
                'ride',
                'maintenance',
                'event',
                'challenge',
                'training',
                'other',
            ]);

            $table->string('color', 7)->nullable(); // ex: #FF5733
            $table->tinyInteger('is_default')->default(0); // 0 = non par défaut, 1 = par défaut
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('type_activities');
    }
};
