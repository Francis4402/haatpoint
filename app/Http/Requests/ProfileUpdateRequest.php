<?php

namespace App\Http\Requests;

use App\Models\Agent;
use App\Rules\GmailAddress;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * KYC columns on `agents` are nullable, and the form sends '' for a field
     * the seller has not filled in yet. Normalising here keeps the rules and
     * Agent::missingVendorProfileFields() agreeing on what "empty" means, and
     * keeps '' from being run against a numeric regex.
     */
    protected function prepareForValidation(): void
    {
        foreach (['mobile', 'national_id', 'address'] as $field) {
            $value = $this->input($field);

            if (is_string($value) && trim($value) === '') {
                $this->merge([$field => null]);
            }
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->user();
        $table = $user?->getTable() ?? 'users';
        $id = $user?->getAuthIdentifier();

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                // Gmail is a registration policy, not a permanent lock: only a
                // change has to stay on Gmail. Applied to the address as stored
                // too, an account created through Google with any other domain
                // could not re-save this form at all.
                ...($this->emailChanged($user) ? [new GmailAddress] : []),
                Rule::unique($table)->ignore($id),
            ],
        ];

        // Only agents have these columns. The rules are conditional on the
        // signed-in model rather than merely on the input, so a customer cannot
        // smuggle them past a User::fill() that has nowhere to put them.
        //
        // Mirrors VendorProfileController and Agent::missingVendorProfileFields
        // -- all three have to agree or a value saved here is one the store
        // gate still rejects.
        if ($user instanceof Agent) {
            $rules += [
                'mobile' => ['nullable', 'string', 'regex:/^01[3-9]\d{8}$/'],
                'national_id' => ['nullable', 'string', 'regex:/^\d{10}$|^\d{17}$/'],
                'address' => ['nullable', 'string', 'max:1000'],
            ];

            // The unique index on both columns would otherwise surface as a
            // 23000 rather than a validation message. Scoped to filled values
            // because a NULL comparison in the presence verifier matches every
            // other unfilled row.
            foreach (['mobile', 'national_id'] as $column) {
                if ($this->filled($column)) {
                    $rules[$column][] = Rule::unique('agents', $column)->ignore($id);
                }
            }
        }

        return $rules;
    }

    /**
     * Whether the submitted address differs from the one on the account.
     */
    private function emailChanged($user): bool
    {
        if (! $user) {
            return true;
        }

        $current = strtolower((string) $user->email);
        $next = strtolower((string) $this->input('email'));

        return $current !== $next;
    }
}
