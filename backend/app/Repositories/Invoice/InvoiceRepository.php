<?php

namespace App\Repositories\Invoice;

use App\Models\Invoice;
use App\Models\InvoiceDetail;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

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
            'client_identification' => $data['client_identification'] ?? null,
            'client_name' => $data['client_name'] ?? null,
            'client_email' => $data['client_email'] ?? null,
            'issue_date' => $data['issue_date'] ?? null,
            'due_date' => $data['due_date'] ?? null,
            'invoice_type' => $data['invoice_type'] ?? 'cash',
            'user_id' => $data['user_id'] ?? null,
            'subtotal' => $data['subtotal'] ?? 0,
            'tax_total' => $data['tax_total'] ?? 0,
            'total' => $data['total'] ?? 0,
        ]);

        if (isset($data['details']) && is_array($data['details'])) {
            foreach ($data['details'] as $item) {
                InvoiceDetail::create([
                    'invoice_id' => $invoice->id,
                    'item_code' => $item['item_code'] ?? ($item['code'] ?? null),
                    'item_name' => $item['item_name'] ?? ($item['name'] ?? null),
                    'unit_price' => $item['unit_price'] ?? 0,
                    'quantity' => $item['quantity'] ?? 0,
                    'applies_tax' => $item['applies_tax'] ?? false,
                    'tax_amount' => $item['tax_amount'] ?? 0,
                    'subtotal' => $item['subtotal'] ?? (($item['unit_price'] ?? 0) * ($item['quantity'] ?? 0)),
                    'total' => $item['total'] ?? (($item['unit_price'] ?? 0) * ($item['quantity'] ?? 0) + ($item['tax_amount'] ?? 0)),
                ]);
            }
        }

        return $invoice;
    }

    public function update(int $id, array $data): bool
    {
        $invoice = Invoice::find($id);
        if (!$invoice) { return false; }

        return $invoice->update($data);
    }

    public function delete(int $id): bool
    {
        $invoice = Invoice::find($id);
        if (!$invoice) { return false; }

        return $invoice->delete();
    }

    public function paginateWithFilters(array $filters, int $perPage = 15)
    {
        $query = Invoice::with('invoiceDetails');

        if (!empty($filters['start_date'])) {
            $query->whereDate('issue_date', '>=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $query->whereDate('issue_date', '<=', $filters['end_date']);
        }

        if (!empty($filters['client'])) {
            $client = $filters['client'];
            $query->where(function ($q) use ($client) {
                $q->where('client_identification', $client)
                  ->orWhere('client_name', 'like', "%{$client}%");
            });
        }

        if (!empty($filters['invoice_type'])) {
            $query->where('invoice_type', $filters['invoice_type']);
        }

        if (!empty($filters['status'])) {
            $status = $filters['status'];
            if (Schema::hasColumn('invoices', 'status')) {
                $query->where('status', $status);
            } else {
                $today = Carbon::today();
                if ($status === 'overdue') {
                    $query->whereDate('due_date', '<', $today);
                } elseif ($status === 'open') {
                    $query->whereDate('due_date', '>=', $today);
                }
            }
        }

        // Sorting
        $allowed = ['issue_date', 'due_date', 'client_name', 'total'];
        $sortBy = $filters['sort_by'] ?? 'issue_date';
        $sortDir = strtolower($filters['sort_dir'] ?? 'desc') === 'asc' ? 'asc' : 'desc';
        if (!in_array($sortBy, $allowed)) { $sortBy = 'issue_date'; }
        $query->orderBy($sortBy, $sortDir);

        return $query->paginate($perPage);
    }
}
