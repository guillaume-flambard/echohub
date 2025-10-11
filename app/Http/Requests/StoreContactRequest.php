<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Any authenticated user can create contacts
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
            'matrix_id' => [
                'required',
                'string',
                'regex:/^@[a-z0-9._=-]+:[a-z0-9.-]+\.[a-z]{2,}$/i', // Matrix ID format
            ],
            'type' => [
                'required',
                'in:app,human',
            ],
            'app_id' => [
                'nullable',
                'exists:apps,id',
                'required_if:type,app', // Required when type is 'app'
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'avatar' => [
                'nullable',
                'string',
                'max:500',
            ],
            'metadata' => [
                'nullable',
                'array',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'matrix_id.required' => 'Matrix user ID is required.',
            'matrix_id.regex' => 'Matrix user ID must be in the format @username:domain.com',
            'type.required' => 'Contact type is required.',
            'type.in' => 'Contact type must be either "app" or "human".',
            'app_id.required_if' => 'App ID is required when creating an app contact.',
            'app_id.exists' => 'The selected app does not exist.',
            'name.required' => 'Contact name is required.',
            'name.max' => 'Contact name cannot exceed 255 characters.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Trim whitespace from name
        if ($this->has('name')) {
            $this->merge([
                'name' => trim($this->name),
            ]);
        }

        // Normalize matrix_id to lowercase
        if ($this->has('matrix_id')) {
            $this->merge([
                'matrix_id' => strtolower(trim($this->matrix_id)),
            ]);
        }
    }
}
