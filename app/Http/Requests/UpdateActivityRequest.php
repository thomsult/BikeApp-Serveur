<?php

namespace App\Http\Requests;

use App\Models\Activity\Activity;
use App\Models\Activity\ActivityEvent;
use App\Models\Activity\ActivityMaintenance;
use App\Models\Activity\ActivityOther;
use App\Models\Activity\ActivityRide;
use App\Models\Activity\ActivityTraining;
use Illuminate\Foundation\Http\FormRequest;

class UpdateActivityRequest extends FormRequest
{
    private $activityClass = Activity::class;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function attributes(): array
    {
        return [
            'title' => 'title',
            'description' => 'description',
            'dt_start' => 'start date',
            'dt_end' => 'end date',
            'started_at' => 'start time',
            'stopped_at' => 'stop time',
            'notes' => 'notes',
            'type_id' => 'type',
            'distance' => 'distance',
            'duration' => 'duration',
            'equipment' => 'equipment',
            'trainingType' => 'training type',

        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = $this->rulesFor($this->activityClass);

        $start_stop_rules = [
            'started_at' => 'sometimes|nullable|date',
            'stopped_at' => 'sometimes|nullable|date|after_or_equal:started_at',
        ];
        $recurrence_rules = [
            'recurrence_frequency' => 'sometimes|required|string|in:daily,weekly,monthly,yearly,manually,none',
            'recurrence_interval' => 'sometimes|nullable|integer|min:0',
        ];
        $completed_at_rules = [
            'completed_at' => 'sometimes|nullable|date|after_or_equal:dt_start',
        ];

        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'dt_start' => 'sometimes|nullable|date',
            'dt_end' => 'sometimes|nullable|date|after_or_equal:dt_start',
            'notes' => 'sometimes|nullable|string',
            'type_id' => 'sometimes|nullable|integer',
            ...$start_stop_rules,
            ...$recurrence_rules,
            ...$completed_at_rules,
            ...$rules,
        ];
    }

    protected function prepareForValidation(): void
    {
        $data = [];

        if ($this->input('typeFamily')) {
            $this->activityClass = match ($this->input('typeFamily')) {
                'ride' => ActivityRide::class,
                'maintenance' => ActivityMaintenance::class,
                'training' => ActivityTraining::class,
                'event' => ActivityEvent::class,
                'other' => ActivityOther::class,
                default => Activity::class,
            };
        }

        if ($this->has('type')) {
            $data['type_id'] = $this->input('type.id');
        }

        if ($this->has(key: 'recurrence')) {

            $data['recurrence_frequency'] = $this->input('recurrence.frequency') ?? 'none';
            $data['recurrence_interval'] = $this->input('recurrence.interval') ?? 0;
        }

        // ✅ On vérifie la clé camelCase qui arrive du front
        if ($this->has('startedAt')) {
            $data['started_at'] = $this->input('startedAt');
        }

        if ($this->has('stoppedAt')) {
            $data['stopped_at'] = $this->input('stoppedAt');
        }
        if ($this->has('completedAt')) {
            $data['completed_at'] = $this->input('completedAt');
        }

        if ($this->has(key: 'equipment')) {
            $data['equipment_id'] = $this->input('equipment')['id'] ?? null;
        }

        if ($this->has(key: 'bike')) {

            $data['bike_id'] = $this->input('bike')['id'] ?? null;
        }

        $this->merge($data);

    }

    protected function rulesFor(string $activityClass): array
    {
        $rideable_rules = [
            'bike_id' => 'sometimes|nullable|integer|exists:bikes,id',
            'equipment_id' => 'sometimes|nullable|integer|exists:components,id',
        ];

        $rules = match ($activityClass) {
            ActivityRide::class => [
                'distance' => 'sometimes|nullable|numeric|min:0',
                'duration' => 'sometimes|nullable|integer|min:0',
                'average_speed' => 'sometimes|nullable|numeric|min:0',
                'max_speed' => 'sometimes|nullable|numeric|min:0',
                'waypoints' => 'sometimes|nullable|array',
                ...$rideable_rules,
            ],
            ActivityMaintenance::class => [
                ...$rideable_rules,
            ],
            ActivityTraining::class => [
                'trainingType' => 'sometimes|nullable|string|max:255',
                'duration' => 'sometimes|nullable|integer|min:0',
            ],
            ActivityEvent::class => [],
            ActivityOther::class => [],
            default => [],

        };

        return array_merge($rules);
    }

    public function withValidator($validator)
    {

        $validator->after(function ($validator) {

            if ($this->activityClass === ActivityMaintenance::class || $this->activityClass === ActivityRide::class) {
                $hasBike = $this->filled('bike_id');
                $hasEquipment = $this->filled('equipment_id');

                if (! $hasBike && ! $hasEquipment) {
                    $validator->errors()->add('bike_id', __('validation.bike_equipment_required'));
                }

                if ($hasBike && $hasEquipment) {
                    $validator->errors()->add('bike_id', __('validation.bike_equipment_exclusive'));
                }
                if ($hasBike && ! $this->user()->bikes()->where('id', $this->input('bike_id'))->exists()) {
                    $validator->errors()->add('bike_id', __('validation.bike_equipment_required'));
                }

            }

        });
    }
}
