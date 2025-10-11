<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAISettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Any authenticated user can update their AI settings
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
            'provider' => [
                'required',
                Rule::in(['ollama', 'openai', 'anthropic']),
            ],
            'model' => [
                'required',
                'string',
                'max:255',
            ],
            'base_url' => [
                'nullable',
                'url',
                'max:500',
                'required_if:provider,ollama', // Base URL required for Ollama
            ],
            'api_key' => [
                'nullable',
                'string',
                'max:500',
                'required_if:provider,openai', // API key required for OpenAI
                'required_if:provider,anthropic', // API key required for Anthropic
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
            'provider.required' => 'Please select an AI provider.',
            'provider.in' => 'Invalid AI provider. Must be ollama, openai, or anthropic.',
            'model.required' => 'Please specify a model name.',
            'base_url.required_if' => 'Base URL is required for Ollama provider.',
            'base_url.url' => 'Base URL must be a valid URL.',
            'api_key.required_if' => 'API key is required for :provider provider.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'base_url' => 'Ollama base URL',
            'api_key' => 'API key',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Trim whitespace from all string fields
        $data = [];

        if ($this->has('provider')) {
            $data['provider'] = strtolower(trim($this->provider));
        }

        if ($this->has('model')) {
            $data['model'] = trim($this->model);
        }

        if ($this->has('base_url')) {
            $data['base_url'] = rtrim(trim($this->base_url), '/');
        }

        if ($this->has('api_key')) {
            $data['api_key'] = trim($this->api_key);
        }

        if (! empty($data)) {
            $this->merge($data);
        }
    }
}
