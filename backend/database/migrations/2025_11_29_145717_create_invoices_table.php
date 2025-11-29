<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         Schema::create('invoices', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->string('client_identification', 20);
        $table->string('client_name', 255);
        $table->string('client_email', 255);
        $table->date('issue_date');
        $table->date('due_date');
        $table->enum('invoice_type', ['cash', 'credit']);
        $table->unsignedBigInteger('user_id');
        $table->decimal('subtotal', 10, 2);
        $table->decimal('tax_total', 10, 2);
        $table->decimal('total', 10, 2);
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};