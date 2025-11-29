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
            'credit_days'           => 'required|integer',
            'invoice_type'          => 'required|in:cash,credit',
            'user_id'               => 'required|integer|exists:users,id',
            'items'                 => 'required|array|min:1',
            'items.*.code'          => 'required|string',
            'items.*.name'          => 'required|string',
            'items.*.unit_price'    => 'required|numeric|min:0',
            'items.*.quantity'      => 'required|numeric|min:0',
            'items.*.tax_amount'    => 'required|numeric|min:0',
            'items.*.description'   => 'nullable|string',
            'items.*.tax_rate'      => 'required|numeric|min:0',
            'items.*.total'         => 'required|numeric|min:0',
        ];
    }
}