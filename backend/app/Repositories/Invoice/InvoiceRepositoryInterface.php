<?php

namespace App\Repositories\Invoice;
use App\Models\Invoice;

interface InvoiceRepositoryInterface
{
    public function all();
    public function paginateWithFilters(array $filters, int $perPage = 15);
    public function find(int $id): ?Invoice;
    public function create(array $data): Invoice;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
