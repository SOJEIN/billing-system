<?php

namespace App\Repositories\Invoice;

use App\Models\Invoice;
use App\Models\InvoiceDetail;

class InvoiceRepository implements InvoiceRepositoryInterface
{
    public function all()
    {
        return Invoice::with('invoiceDetails')->get();
    }

    public function find(int $id): ?Invoice
    {
        return Invoice::with('invoiceDetails')->find($id);
    }

    public function create(array $data): Invoice
    {
        $invoice = Invoice::create([
            'invoice_number' => $data['invoice_number'] ?? null,
            'customer_id' => $data['customer_id'] ?? null,
            'total' => $data['total'] ?? 0,
        ]);

        if (isset($data['details']) && is_array($data['details'])) {
            foreach ($data['details'] as $item) {
                InvoiceDetail::create([
                    'invoice_id' => $invoice->id,
                    'code' => $item['code'],
                    'name' => $item['name'],
                    'unit_price' => $item['unit_price'],
                    'quantity' => $item['quantity'],
                    'tax_amount' => $item['tax_amount'],
                    'subtotal' => $item['unit_price'] * $item['quantity'],
                    'total' => ($item['unit_price'] * $item['quantity']) + $item['tax_amount'],
                ]);
            }
        }

        return $invoice;
    }

    public function update(int $id, array $data): bool
    {
        $invoice = Invoice::find($id);
        if (!$invoice) return false;

        return $invoice->update($data);
    }

    public function delete(int $id): bool
    {
        $invoice = Invoice::find($id);
        if (!$invoice) return false;

        return $invoice->delete();
    }
}