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




    public function index(Request $request)
    {
        $filters = $request->only(['start_date', 'end_date', 'client', 'status', 'invoice_type', 'sort_by', 'sort_dir']);
        $perPage = (int) $request->query('per_page', 15);

        // sanitize sorting
        $allowedSort = ['issue_date', 'due_date', 'client_name', 'total'];
        $sortBy = in_array($filters['sort_by'] ?? null, $allowedSort) ? $filters['sort_by'] : 'issue_date';
        $sortDir = strtolower($filters['sort_dir'] ?? 'desc') === 'asc' ? 'asc' : 'desc';
        $filters['sort_by'] = $sortBy;
        $filters['sort_dir'] = $sortDir;

        $paginator = $this->invoiceRepository->paginateWithFilters(array_filter($filters), $perPage);
        return response()->json($paginator);
    }

    public function show($id)
    {
        $invoice = $this->invoiceRepository->find($id);
        if (!$invoice) {
            return response()->json(['message' => 'Factura no encontrada'], 404);
        }

        return response()->json(['data' => $invoice->load('invoiceDetails')]);
    }

}