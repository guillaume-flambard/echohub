<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateAISettingsRequest;
use App\Models\AISetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AISettingController extends Controller
{
    /**
     * Get the current AI settings
     */
    public function index(Request $request)
    {
        $setting = AISetting::getActive($request->user()->id);

        // If no setting exists, create default from env
        if (! $setting) {
            $setting = AISetting::create([
                'user_id' => null, // Global setting
                'provider' => config('minerva.provider'),
                'model' => config('minerva.model'),
                'base_url' => config('minerva.base_url'),
                'api_key' => config('minerva.api_key'),
                'is_active' => true,
            ]);
        }

        return response()->json([
            'setting' => [
                'id' => $setting->id,
                'provider' => $setting->provider,
                'model' => $setting->model,
                'base_url' => $setting->base_url,
                'has_api_key' => ! empty($setting->api_key),
            ],
        ]);
    }

    /**
     * Update AI settings
     */
    public function update(UpdateAISettingsRequest $request)
    {
        // Authorization and validation handled in UpdateAISettingsRequest
        $validated = $request->validated();

        $setting = AISetting::getActive($request->user()->id);

        if ($setting) {
            $setting->update($validated);
        } else {
            $setting = AISetting::create([
                ...$validated,
                'user_id' => null, // Global setting
                'is_active' => true,
            ]);
        }

        return response()->json([
            'message' => 'AI settings updated successfully',
            'setting' => [
                'id' => $setting->id,
                'provider' => $setting->provider,
                'model' => $setting->model,
                'base_url' => $setting->base_url,
                'has_api_key' => ! empty($setting->api_key),
            ],
        ]);
    }

    /**
     * Get available models for a provider
     */
    public function availableModels(Request $request)
    {
        $provider = $request->input('provider', 'ollama');

        $models = match ($provider) {
            'ollama' => $this->getOllamaModels($request->input('base_url', config('minerva.base_url'))),
            'openai' => $this->getOpenAIModels(),
            'anthropic' => $this->getAnthropicModels(),
            default => [],
        };

        return response()->json(['models' => $models]);
    }

    /**
     * Get available Ollama models from the API
     */
    private function getOllamaModels(string $baseUrl): array
    {
        try {
            $response = Http::timeout(5)->get("{$baseUrl}/api/tags");

            if ($response->successful()) {
                $models = $response->json('models', []);

                return collect($models)->map(fn ($model) => [
                    'id' => $model['name'],
                    'name' => $model['name'],
                ])->toArray();
            }
        } catch (\Exception $e) {
            // Ollama not available, return default models
        }

        return [
            ['id' => 'llama3.2:3b', 'name' => 'Llama 3.2 (3B)'],
            ['id' => 'llama3.2:1b', 'name' => 'Llama 3.2 (1B)'],
            ['id' => 'qwen2.5:3b', 'name' => 'Qwen 2.5 (3B)'],
            ['id' => 'phi3.5', 'name' => 'Phi 3.5'],
            ['id' => 'mistral', 'name' => 'Mistral'],
        ];
    }

    /**
     * Get available OpenAI models
     */
    private function getOpenAIModels(): array
    {
        return [
            ['id' => 'gpt-4-turbo-preview', 'name' => 'GPT-4 Turbo'],
            ['id' => 'gpt-4', 'name' => 'GPT-4'],
            ['id' => 'gpt-3.5-turbo', 'name' => 'GPT-3.5 Turbo'],
        ];
    }

    /**
     * Get available Anthropic models
     */
    private function getAnthropicModels(): array
    {
        return [
            ['id' => 'claude-3-5-sonnet-20250219', 'name' => 'Claude 3.5 Sonnet'],
            ['id' => 'claude-3-opus-20240229', 'name' => 'Claude 3 Opus'],
            ['id' => 'claude-3-haiku-20240307', 'name' => 'Claude 3 Haiku'],
        ];
    }
}
