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
        Schema::create('invoice_details', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->unsignedBigInteger('invoice_id');
        $table->string('item_code', 50);
        $table->string('item_name', 255);
        $table->decimal('unit_price', 10, 2);
        $table->integer('quantity');
        $table->boolean('applies_tax');
        $table->decimal('tax_amount', 10, 2);
        $table->decimal('subtotal', 10, 2);
        $table->decimal('total', 10, 2);
        $table->timestamps();
        // Definimos la llave foránea
        $table->foreign('invoice_id')->references('id')->on('invoices')->onDelete('cascade');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_details');
    }
};