<?php

namespace App\Http\Requests;

use App\Models\Bikes\Components\Components;
use App\Service\ComponentService;
use DomainException;
use Illuminate\Foundation\Http\FormRequest;

class BikeComponentsRequest extends FormRequest
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
            'model' => 'required|string',
            'type' => 'required|array',
            'status' => 'required|integer|min:0|max:100',
            'multi_bike' => 'required|boolean',
            'type_id' => 'required|integer|exists:type_components_bikes,id',
            'brand_id' => 'required|integer|exists:brand_components_bikes,id',
        ];
    }

    public function prepareForValidation()
    {

        $this->merge([
            'type_id' => $this->input('type.id'),
            'brand_id' => $this->input('brand.id'),
            'multi_bike' => filter_var($this->input('multiBike'), FILTER_VALIDATE_BOOLEAN),
        ]);
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            /** @var Components $component */
            $component = $this->route('component');

            // Si le champ n'est pas modifié, on sort
            if (! $this->has('multi_bike') || ! isset($component)) {
                return;
            }

            try {

                ComponentService::validateMultiBikeChange($component, $this->boolean('multi_bike'));
            } catch (DomainException $e) {
                $this->merge([
                    'multi_bike' => true,
                ]);
                $validator->errors()->add('multiBike', $e->getMessage());

            }
        });
    }
}
