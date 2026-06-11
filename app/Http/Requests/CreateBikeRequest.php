<?php

namespace App\Http\Requests;

use App\Models\Bikes\Components\Components;
use App\Models\Bikes\ComponentsBike;
use Illuminate\Foundation\Http\FormRequest;

class CreateBikeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'type_bike_id' => 'required|exists:type_bikes,id',
            'preferred' => 'boolean',
            'status' => 'integer|min:0|max:100',
            'image_url' => 'nullable|string|max:255',
            'stats' => 'array|required',
            ...$this->statsRules(),
            ...$this->componentsRules(),
        ];
    }

    protected function prepareForValidation(): void
    {
        $service = [
            'stats.service.method' => $this->input('stats.service.method', 'none'),
            'stats.service.interval_distance' => $this->input('stats.service.intervalDistance', 0),
            'stats.service.interval_time' => $this->input('stats.service.intervalTime', 0),
            'stats.service.interval_rides' => $this->input('stats.service.intervalRides', 0),
            'stats.service.manual_note' => $this->input('stats.service.manualNote', null),
        ];

        $stats = [
            'stats.distance' => $this->input('stats.distance', 0),
            'stats.rides' => $this->input('stats.rides', 0),
            'stats.last_service_date' => $this->input('stats.lastService', null),
            ...$service,
        ];

        $this->merge([
            'type_bike_id' => $this->input('type.id'),
            'status' => $this->input('status', 0),
            'preferred' => $this->input('preferred', false),
            'image_url' => $this->input('image', null),
            ...$stats,
        ]);

        foreach ($this->input('components', []) as $component) {
            $userId = $this->user()->id;

            $componentIds = collect($this->input('components', []))
                ->pluck('id')
                ->toArray();

            $components = Components::whereIn('id', $componentIds)
                ->where('user_id', $userId)
                ->get()
                ->keyBy('id');

            if ($components->count() !== count($componentIds)) {
                abort(422, 'One or more components do not belong to the user.');
            }

            $componentsWithBike = ComponentsBike::whereIn('component_id', $componentIds)
                ->where('bike_id', '!=', $this->route('bike')->id ?? null)
                ->pluck('component_id')
                ->unique();

            foreach ($componentsWithBike as $componentId) {
                if ($components[$componentId]->multi_bike === false) {
                    abort(422, "Component with id {$componentId} cannot be associated with multiple bikes.");
                }
            }
        }
        $this->merge([
            'components' => array_map(
                fn ($component) => $component['id'],
                $this->input('components', [])
            ),
        ]);

    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {

            // Si le champ n'est pas modifié, on sort
            if (! $this->has('preferred')) {
                return;
            }

            if ($this->boolean('preferred') === true) {
                $userId = $this->user()->id;

                $existingPreferredBike = $this->route('bike')
                    ? $this->route('bike')->where('user_id', $userId)->where('preferred', true)->where('id', '!=', $this->route('bike')->id)->first()
                    : null;

                if ($existingPreferredBike) {
                    $validator->errors()->add('preferred', __('bike.preferred_bike_error'));
                }
            }

        });
    }

    private function statsRules(): array
    {
        return [
            'stats.distance' => 'numeric|min:0',
            'stats.rides' => 'numeric|min:0',
            'stats.last_service_date' => 'date|nullable',
            'stats.service' => 'array|required',
            ...$this->serviceRules(),
        ];
    }

    private function serviceRules(): array
    {
        return [
            'stats.service.method' => 'string|in:useLastServiceDate,distanceInterval,timeInterval,ridesInterval,manual,none',
            'stats.service.interval_distance' => 'numeric|min:0',
            'stats.service.interval_time' => 'numeric|min:0',
            'stats.service.interval_rides' => 'numeric|min:0',
            'stats.service.manual_note' => 'string|nullable',

        ];
    }

    private function componentsRules(): array
    {
        return [
            'components' => 'array',
            // 'components.id' => 'exists:components,id',

        ];
    }
}
