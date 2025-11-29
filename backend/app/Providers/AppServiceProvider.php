<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Invoice\InvoiceRepositoryInterface;
use App\Repositories\Invoice\InvoiceRepository;
use App\Repositories\InvoiceDetail\InvoiceDetailRepositoryInterface;
use App\Repositories\InvoiceDetail\InvoiceDetailRepository;
class AppServiceProvider extends ServiceProvider
{
    
    public function register(): void
    {
        $this->app->bind(InvoiceRepositoryInterface::class, InvoiceRepository::class);
        $this->app->bind(InvoiceDetailRepositoryInterface::class, InvoiceDetailRepository::class);
    }

   
    public function boot(): void
    {
        //
    }
}