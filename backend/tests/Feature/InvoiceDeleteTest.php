<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Invoice;
use App\Models\User;
use Carbon\Carbon;

class InvoiceDeleteTest extends TestCase
{
    use RefreshDatabase;

    public function test_delete_invoice_returns_204()
    {
        $user = User::factory()->create();
        $invoice = Invoice::create([
            'client_identification' => '555',
            'client_name' => 'Delete Test',
            'client_email' => 'delete@example.com',
            'issue_date' => Carbon::today()->toDateString(),
            'due_date' => Carbon::today()->addDays(5)->toDateString(),
            'invoice_type' => 'credit',
            'user_id' => $user->id,
            'subtotal' => 150,
            'tax_total' => 15,
            'total' => 165,
        ]);

        $response = $this->deleteJson('/api/invoices/' . $invoice->id);
        $response->assertStatus(204);

        $this->assertDatabaseMissing('invoices', ['id' => $invoice->id]);
    }

    public function test_delete_invoice_returns_404_for_missing()
    {
        $response = $this->deleteJson('/api/invoices/999999');
        $response->assertStatus(404);
    }
}
