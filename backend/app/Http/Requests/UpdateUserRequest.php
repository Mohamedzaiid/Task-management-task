<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\User;
use Illuminate\Validation\Rules;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes', 'required', 'string', 'lowercase', 'email', 'max:255', 
                Rule::unique(User::class)->ignore($this->route('user')->id ?? $this->user->id) 
            ],
            'password' => ['sometimes', 'nullable', 'confirmed', Rules\Password::defaults()],
            'role' => ['sometimes', 'required', 'in:admin,user'],
        ];
    }
}
