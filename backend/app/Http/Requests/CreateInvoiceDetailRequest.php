<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateInvoiceDetailRequest extends FormRequest
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
            'invoice_id'   => 'required|integer|exists:invoices,id',
            'item_code'    => 'required|string|max:50',
            'item_name'    => 'required|string|max:255',
            'unit_price'   => 'required|numeric|min:0',
            'quantity'     => 'required|integer|min:1',
            'applies_tax'  => 'required|boolean',
            'tax_amount'   => 'required|numeric|min:0',
            'subtotal'     => 'required|numeric|min:0',
            'total'        => 'required|numeric|min:0',
        ];
    }
}