<?php

namespace Database\Seeders;

use App\Models\TypeBike;
use Illuminate\Database\Seeder;

class TypeBikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $typeBikes = [
            ['label' => 'Road'],
            ['label' => 'Mountain'],
            ['label' => 'Hybrid'],
            ['label' => 'Electric'],
            ['label' => 'Gravel'],
            ['label' => 'Cyclocross'],
            ['label' => 'Folding'],
            ['label' => 'Cargo'],
            ['label' => 'Other'],
        ];

        foreach ($typeBikes as $typeBike) {
            TypeBike::create($typeBike);
        }
    }
}
