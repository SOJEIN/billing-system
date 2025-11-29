<?php

namespace App\Services;

use Carbon\Carbon;

class InvoiceCalculationService
{

    /** calcula el subtotal de una factura*/
   public function calculateSubtotal(array $details): float
   {
       $subtotal = 0.0;
       foreach ($details as $detail) {
           $subtotal += $detail['unit_price'] * $detail['quantity'];
       }
       return round($subtotal, 2);
   }

   /** calcula el total de impuestos */
   public function calculateTaxTotal(array $details): float
    {
        $taxTotal = 0;

        foreach ($details as $detail) {
            $taxTotal += $detail['tax_amount'];
        }

        return round($taxTotal, 2);
    }

    /**
     * Calcula el total de la factura (subtotal + impuestos)
     */

    public function calculateTotal(float $subtotal, float $taxTotal): float
    {
        return round($subtotal + $taxTotal, 2);
    }

    /** calcula la fecha de vencimiento segun la fecha de emision y dias de credito  */

    public function calculateDueDate(string $issueDate, int $days): string
    {
        return Carbon::parse($issueDate)->addDays($days)->format('Y-m-d');
    }
}