<?php

namespace App\Http\Requests;

use App\Models\Activity\Activity;
use App\Models\Activity\ActivityEvent;
use App\Models\Activity\ActivityMaintenance;
use App\Models\Activity\ActivityOther;
use App\Models\Activity\ActivityRide;
use App\Models\Activity\ActivityTraining;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateActivityRequest extends FormRequest
{
    private $activityClass = Activity::class;

    const DEFAULT_VALIDATION_RULES = [
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'dt_start' => 'required|date',
        'dt_end' => 'nullable|date|after_or_equal:dt_start',
        'notes' => 'nullable|string',
        'type_id' => 'required|integer',
    ];

    const RECURRENCE_RULES = [
        'recurrence_frequency' => 'required|string|in:daily,weekly,monthly,yearly,manually,none',
        'recurrence_interval' => 'sometimes|nullable|integer|min:0',
    ];

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
            'equipment_id' => 'Equipment',
            'bike_id' => 'Bike',

        ];
    }

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

        $rules = $this->rulesFor($this->activityClass);

        return [
            ...self::DEFAULT_VALIDATION_RULES,
            ...self::RECURRENCE_RULES,
            ...$rules,
            'class' => [
                'required',
                Rule::in([
                    Activity::class,
                    ActivityEvent::class,
                    ActivityMaintenance::class,
                    ActivityOther::class,
                    ActivityRide::class,
                    ActivityTraining::class,
                ]),
            ],
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
        if ($this->has(key: 'type')) {
            $data['type_id'] = $this->input('type.id');
        }

        if ($this->has(key: 'recurrence')) {
            $data['recurrence_frequency'] = $this->input('recurrence.frequency') ?? 'none';
            $data['recurrence_interval'] = $this->input('recurrence.interval') ?? 0;
        }

        if ($this->has(key: 'equipment')) {
            $data['equipment_id'] = $this->input('equipment.id');
        }

        if ($this->has(key: 'bike')) {

            $data['bike_id'] = $this->input('bike.id');
        }

        $data['class'] = $this->activityClass ?? Activity::class;
        $this->merge($data);
    }

    protected function rulesFor(string $activityClass): array
    {

        $rules = match ($activityClass) {
            ActivityRide::class => [
                'distance' => 'sometimes|required|numeric|min:0',
                'duration' => 'sometimes|required|integer|min:0',
                'average_speed' => 'sometimes|nullable|numeric|min:0',
                'max_speed' => 'sometimes|nullable|numeric|min:0',
                'waypoints' => 'sometimes|nullable|array',
                'equipment_id' => 'sometimes|nullable|integer|exists:components,id',
                'bike_id' => 'sometimes|nullable|integer|exists:bikes,id',
            ],
            ActivityMaintenance::class => [
                'equipment_id' => 'sometimes|nullable|integer|exists:components,id',
                'bike_id' => 'sometimes|nullable|integer|exists:bikes,id',
            ],
            ActivityTraining::class => [
                'trainingType' => 'sometimes|required|string|max:255',
                'duration' => 'sometimes|required|integer|min:0',
            ],
            ActivityEvent::class => [],
            ActivityOther::class => [],
            default => [],

        };

        return $rules;
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->activityClass === ActivityMaintenance::class) {
                $hasBike = $this->filled('bike_id');
                $hasEquipment = $this->filled('equipment_id');

                if (! $hasBike && ! $hasEquipment) {
                    $validator->errors()->add('bike_id', __('validation.bike_equipment_required'));
                }
                // 'Un vélo ou un équipement est requis.'

                if ($hasBike && $hasEquipment) {
                    $validator->errors()->add('bike_id', __('validation.bike_equipment_exclusive'));
                }

            }

        });
    }
}
