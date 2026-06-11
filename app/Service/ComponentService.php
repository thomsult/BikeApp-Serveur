<?php

namespace App\Service;

use App\Models\Bikes\Components\Components;

class ComponentService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public static function validateMultiBikeChange(Components $component, $newValue)
    {

        // On vérifie uniquement si multi_bike change
        if (
            $component->getOriginal('multi_bike') === true &&
            $newValue === false
        ) {

            $bikesCount = $component->bikes()->count();

            if ($bikesCount > 1) {

                throw new \DomainException(
                    __('bike_components.multi_bike_change_error', ['count' => $bikesCount])
                );
            }
        }
    }

    public static function validateMultipleBikesDelete(Components $component)
    {
        if ($component->multi_bike) {

            $bikesCount = $component->bikes()->count();

            if ($bikesCount > 0) {

                throw new \DomainException(
                    __('bike_components.multi_bike_delete_error', ['count' => $bikesCount])
                );
            }
        }
    }
}
