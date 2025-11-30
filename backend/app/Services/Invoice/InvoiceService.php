<?php

namespace App\Services\Invoice;

use App\Repositories\Invoice\InvoiceRepositoryInterface;
use Illuminate\Support\Facades\DB;

class InvoiceService
{
    protected $invoiceRepository;

    public function __construct(InvoiceRepositoryInterface $invoiceRepository)
    {
        $this->invoiceRepository = $invoiceRepository;
    }

    public function createInvoice(array $data)
    {
        return DB::transaction(function () use ($data) {
            return $this->invoiceRepository->create($data);
        });
    }

    public function getAll()
    {
        return $this->invoiceRepository->all();
    }

    public function getById(int $id)
    {
        return $this->invoiceRepository->find($id);
    }

    public function listInvoices(array $filters = [], int $perPage = 15)
    {
        return $this->invoiceRepository->paginateWithFilters($filters, $perPage);
    }

    public function deleteInvoice(int $id): bool
    {
        return $this->invoiceRepository->delete($id);
    }
}
