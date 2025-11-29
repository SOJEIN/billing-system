<?php

namespace App\Repositories\InvoiceDetail;

use App\Models\InvoiceDetail;

interface InvoiceDetailRepositoryInterface
{
    public function all();

    public function find(int $id): ?InvoiceDetail;

    public function create(array $data): InvoiceDetail;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;
}