<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\User;
use Carbon\Carbon;

class InvoiceShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_show_invoice_returns_200_with_details()
    {
        $user = User::factory()->create();

        $invoice = Invoice::create([
            'client_identification' => '333',
            'client_name' => 'Show Test',
            'client_email' => 'show@example.com',
            'issue_date' => Carbon::today()->toDateString(),
            'due_date' => Carbon::today()->addDays(5)->toDateString(),
            'invoice_type' => 'cash',
            'user_id' => $user->id,
            'subtotal' => 120,
            'tax_total' => 12,
            'total' => 132,
        ]);

        $invoice->invoiceDetails()->create([
            'item_code' => 'X1',
            'item_name' => 'Item X',
            'unit_price' => 120,
            'quantity' => 1,
            'applies_tax' => true,
            'tax_amount' => 12,
            'subtotal' => 120,
            'total' => 132,
        ]);

        $response = $this->getJson('/api/invoices/' . $invoice->id);
        $response->assertStatus(200);
        $response->assertJsonStructure(['data' => ['id', 'client_identification', 'invoiceDetails']]);
        $this->assertEquals('333', $response->json('data.client_identification'));
        $this->assertNotEmpty($response->json('data.invoiceDetails'));
    }

    public function test_show_invoice_returns_404_when_missing()
    {
        $response = $this->getJson('/api/invoices/999999');
        $response->assertStatus(404);
    }
}
