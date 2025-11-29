<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;
    protected $fillable = [
        'client_identification',
        'client_name',
        'client_email',
        'issue_date',
        'due_date',
        'invoice_type',
        'user_id',
        'subtotal',
        'tax_total',
        'total',
    ];

    public function details()
    {
        return $this->hasMany(InvoiceDetail::class);
    }
}