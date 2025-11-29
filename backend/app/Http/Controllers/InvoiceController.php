<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\CreateInvoiceRequest;
use App\Services\InvoiceCalculationService;
use App\Repositories\Invoice\InvoiceRepositoryInterface;

class InvoiceController extends Controller
{
    protected $invoiceCalculationService;
    protected $invoiceRepository;

    public function __construct(
        InvoiceCalculationService $invoiceCalculationService, InvoiceRepositoryInterface $invoiceRepository
    ) {
        $this->invoiceCalculationService = $invoiceCalculationService;
        $this->invoiceRepository = $invoiceRepository;
    }

    public function store(CreateInvoiceRequest $request)
{
    $data = $request->validated();
    $items = $data['items'];
    $subtotal = $this->invoiceCalculationService->calculateSubtotal($items);
    $taxTotal = $this->invoiceCalculationService->calculateTaxTotal($items);
    $total = $this->invoiceCalculationService->calculateTotal($subtotal, $taxTotal);
    $dueDate = $this->invoiceCalculationService->calculateDueDate(
        $data['issue_date'],
        $data['credit_days']
    );

    $data['subtotal'] = $subtotal;
    $data['tax_total'] = $taxTotal;
    $data['total'] = $total;
    $data['due_date'] = $dueDate;
    $invoice = $this->invoiceRepository->create($data);

     return response()->json([
        'message' => 'Factura creada correctamente',
        'data' => $invoice->load('invoiceDetails')
    ], 201);
}

}