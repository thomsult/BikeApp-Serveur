<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Modifier la table activities
        Schema::table('activities', function (Blueprint $table) {
            $table->dropColumn(['bike_id', 'equipment_id']);
        });

        Schema::table('activities', function (Blueprint $table) {
            // Relation polymorphique : Bike ou Component
            // Crée rideable_type (string) + rideable_id (bigint)
            $table->nullableMorphs('rideable');

            // Champs venant de rides
            $table->json('waypoints')->nullable()->after('rideable_id');
            $table->decimal('average_speed', 5, 2)->nullable()->after('waypoints');
            $table->decimal('max_speed', 5, 2)->nullable()->after('average_speed');
            $table->string('image_url')->nullable()->after('max_speed');
        });

        // 3. Supprimer la table rides
        Schema::dropIfExists('rides');
    }

    public function down(): void
    {
        Schema::create('rides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->decimal('distance', 8, 2);
            $table->integer('duration');
            $table->decimal('average_speed', 5, 2)->nullable();
            $table->decimal('max_speed', 5, 2)->nullable();
            $table->string('image_url')->nullable();
            $table->text('memo')->nullable();
            $table->json('waypoints')->nullable();
            $table->timestamp('started_at');
            $table->timestamp('end_at')->nullable();
            $table->timestamps();
        });

        Schema::table('activities', function (Blueprint $table) {
            $table->dropMorphs('rideable');
            $table->dropColumn(['waypoints', 'average_speed', 'max_speed', 'image_url']);
        });

        Schema::table('activities', function (Blueprint $table) {
            $table->string('bike_id')->nullable();
            $table->string('equipment_id')->nullable();
        });
    }
};
