<?php

namespace App\Http\Resources\Activity;

use App\Enums\TypeActivityFamily;
use App\Http\Resources\Bikes\BikeResource;
use App\Http\Resources\Bikes\Components\ComponentsResource;
use App\Http\Resources\TypeActivityResource;
use App\Models\Activity\ActivityEvent;
use App\Models\Activity\ActivityMaintenance;
use App\Models\Activity\ActivityOther;
use App\Models\Activity\ActivityRide;
use App\Models\Activity\ActivityTraining;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public static $wrap = null;

    /**
     * @return array{
     *   id: int,
     *   title: string,
     *   description: string,
     *   type: TypeActivityResource,
     *   typeFamily: TypeActivityFamily,
     *   dt_start: string,
     *   dt_end: string,
     *   notes: string,
     *   completedAt: string|null,
     *   createdAt: string|null,
     *   updatedAt: string|null,
     *   recurrence: array{frequency: string|null, interval: int|null},
     *   shareUrl: string,
     *    // For ActivityRide
     *    distance?: float|null,
     *    duration?: int|null,
     *    avgSpeed?: float|null,
     *    maxSpeed?: float|null,
     *   waypoints?: array|null,
     *   startedAt?: string|null,
     *  stoppedAt?: string|null,
     *    // For ActivityTraining
     *    trainingType?: 'interval'|'endurance'|'tempo'|'recovery'|null,
     *    // For ActivityMaintenance
     *    maintenanceType?: string|null,
     *   // For ActivityEvent
     *    bike?: BikeResource|null,
     *    component?: ComponentsResource|null,
     * }
     */
    public function toArray(Request $request): array
    {
        $class = $this->resource->getMorphClass();

        $specific = match ($class) {
            ActivityRide::class => ActivityRideResource::make($this->resource)->toArray($request),
            ActivityTraining::class => ActivityTrainingResource::make($this->resource)->toArray($request),
            ActivityMaintenance::class => ActivityMaintenanceResource::make($this->resource)->toArray($request),
            ActivityOther::class => [],
            ActivityEvent::class => [],
            default => [],
        };

        return array_merge([
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->typeActivity
    ? TypeActivityResource::make($this->typeActivity)
    : null,
            'typeFamily' => match ($class) {
                ActivityRide::class => 'ride',
                ActivityTraining::class => 'training',
                ActivityMaintenance::class => 'maintenance',
                ActivityEvent::class => 'event',
                ActivityOther::class => 'other',
                default => 'other',
            },

            'dt_start' => $this->dt_start,
            'dt_end' => $this->dt_end,
            // 'location' => $this->location,
            'notes' => $this->notes,
            'completedAt' => $this->completed_at ?? null,
            'createdAt' => $this->created_at ?? null,
            'updatedAt' => $this->updated_at ?? null,
            'recurrence' => [
                'frequency' => $this->recurrence_frequency,
                'interval' => $this->recurrence_interval,
            ],
            'shareUrl' => $this->share_url,
        ], $specific);
    }

    protected function getRideable()
    {
        if (! $this->resource->rideable_type) {
            return []; // ← court-circuit si pas de rideable, évite une requête inutile
        }
        $rideable = match ($this->resource->rideable_type) {
            'App\Models\Bikes\Bike' => [
                'bike' => BikeResource::make($this->resource->rideable),
            ],
            'App\Models\Bikes\Components\Components' => [
                'component' => ComponentsResource::make($this->resource->rideable),
            ],
            default => [],
        };

        return $rideable;
    }
}
