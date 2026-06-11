<?php

namespace Database\Seeders;

use App\Models\Bikes\Components\ComponentsBrand;
use App\Models\Bikes\Components\ComponentsType;
use Illuminate\Database\Seeder;

class ComponentsBrandAndType extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['label' => 'frame'],
            ['label' => 'group-set'],
            ['label' => 'wheel'],
            ['label' => 'saddle'],
            ['label' => 'fork'],
            ['label' => 'tire'],
            ['label' => 'handlebar'],
            ['label' => 'brake'],
            ['label' => 'chain'],
            ['label' => 'cassette'],
            ['label' => 'pedal'],
        ];

        $brands = [
            ['label' => 'Shimano'],
            ['label' => 'Sram'],
            ['label' => 'Campagnolo'],
            ['label' => 'Mavic'],
            ['label' => 'FSA'],
            ['label' => 'Fizik'],
            ['label' => 'Fox'],
            ['label' => 'Maxxis'],
            ['label' => 'Continental'],
            ['label' => 'Schwalbe'],
            ['label' => 'Specialized'],
        ];

        foreach ($types as $key => $value) {
            ComponentsType::create($value);
        }

        foreach ($brands as $key => $value) {
            ComponentsBrand::create($value);
        }
    }
}
