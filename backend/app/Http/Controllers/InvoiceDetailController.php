<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\InvoiceDetail;
use App\Models\Invoice;

class InvoiceDetailController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => 'required|integer|exists:invoices,id',
            'item_code' => 'required|string|max:255',
            'item_name' => 'required|string|max:255',
            'unit_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'applies_tax' => 'required|boolean',
        ]);

        $taxRate = 0.19;
        $unitPrice = (float) $validated['unit_price'];
        $quantity = (int) $validated['quantity'];
        $subtotal = $unitPrice * $quantity;
        $taxAmount = $validated['applies_tax'] ? round($subtotal * $taxRate, 2) : 0.00;
        $total = $subtotal + $taxAmount;

        $detail = InvoiceDetail::create([
            'invoice_id' => $validated['invoice_id'],
            'item_code' => $validated['item_code'],
            'item_name' => $validated['item_name'],
            'unit_price' => $unitPrice,
            'quantity' => $quantity,
            'applies_tax' => $validated['applies_tax'],
            'tax_amount' => $taxAmount,
            'subtotal' => $subtotal,
            'total' => $total,
        ]);

         $invoice = Invoice::with('invoiceDetails')->find($validated['invoice_id']);
        if ($invoice) {
            $invoiceSubtotal = $invoice->invoiceDetails->sum('subtotal');
            $invoiceTaxTotal = $invoice->invoiceDetails->sum('tax_amount');
            $invoiceTotal = $invoice->invoiceDetails->sum('total');

            $invoice->update([
                'subtotal' => $invoiceSubtotal,
                'tax_total' => $invoiceTaxTotal,
                'total' => $invoiceTotal,
            ]);
        }

        return response()->json($detail, 201);
    }
}