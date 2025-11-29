<?php

namespace App\Repositories\InvoiceDetail;

use App\Models\InvoiceDetail;

class InvoiceDetailRepository implements InvoiceDetailRepositoryInterface
{
    public function all()
    {
        return InvoiceDetail::all();
    }

    public function find(int $id): ?InvoiceDetail
    {
        return InvoiceDetail::find($id);
    }

    public function create(array $data): InvoiceDetail
    {
        return InvoiceDetail::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $detail = InvoiceDetail::find($id);
        if (!$detail) return false;

        return $detail->update($data);
    }

    public function delete(int $id): bool
    {
        $detail = InvoiceDetail::find($id);
        if (!$detail) return false;

        return $detail->delete();
    }
}