<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateInvoiceRequest extends FormRequest
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
            'client_identification' => 'required|string|max:20',
            'client_name'           => 'required|string|max:255',
            'client_email'          => 'required|email|max:255',
            'issue_date'            => 'required|date',
            'due_date'              => 'required|date|after_or_equal:issue_date',
            'invoice_type'          => 'required|in:cash,credit',
            'user_id'               => 'required|integer|exists:users,id',
            'subtotal'              => 'required|numeric|min:0',
            'tax_total'             => 'required|numeric|min:0',
            'total'                 => 'required|numeric|min:0',
        ];
    }
}