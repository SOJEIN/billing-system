<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Invoice;
use App\Models\User;
use Carbon\Carbon;

class InvoiceListFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_invoices_with_filters()
    {
        // Create a user
        $user = User::factory()->create();

        // Create invoices
        Invoice::create([
            'client_identification' => '111',
            'client_name' => 'John Doe',
            'client_email' => 'john@example.com',
            'issue_date' => Carbon::today()->subDays(2)->toDateString(),
            'due_date' => Carbon::today()->addDays(5)->toDateString(),
            'invoice_type' => 'credit',
            'user_id' => $user->id,
            'subtotal' => 100,
            'tax_total' => 10,
            'total' => 110,
        ]);

        Invoice::create([
            'client_identification' => '222',
            'client_name' => 'Jane Smith',
            'client_email' => 'jane@example.com',
            'issue_date' => Carbon::today()->subDays(10)->toDateString(),
            'due_date' => Carbon::today()->subDays(1)->toDateString(),
            'invoice_type' => 'cash',
            'user_id' => $user->id,
            'subtotal' => 200,
            'tax_total' => 20,
            'total' => 220,
        ]);

        // Default list.
        $response = $this->getJson('/api/invoices');
        $response->assertStatus(200);
        $response->assertJsonStructure(['data', 'links', 'meta']);

        // Filter by client.
        $response = $this->getJson('/api/invoices?client=John');
        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));

        // Filter overdue (the second invoice is overdue)
        $response = $this->getJson('/api/invoices?status=overdue');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        $this->assertEquals('222', $data[0]['client_identification']);
    }
}
