<?php

namespace App\Observers;

use App\Models\Bikes\Components\Components;
use App\Service\ComponentService;
use DomainException;

class ComponentsMultiBikeObserver
{
    public function updating(Components $component): void
    {
        if (! $component->isDirty('multi_bike')) {
            return;
        }

        try {
            ComponentService::validateMultiBikeChange(
                $component,
                $component->multi_bike
            );
        } catch (DomainException $e) {
            // On annule la modification AVANT le save
            $component->multi_bike = $component->getOriginal('multi_bike');
        }
    }
}
