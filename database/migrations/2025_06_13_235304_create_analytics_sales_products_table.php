<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnalyticsSalesProductsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('analytics_sales_products', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('sales_id'); // sales_id INT
            $table->unsignedBigInteger('product_id'); // product_id INT
            $table->integer('quantity_sold'); // quantity_sold INT
            $table->decimal('revenue', 10, 2); // revenue DECIMAL(10,2)
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            $table->foreign('sales_id')->references('id')->on('analytics_sales')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Annule les migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('analytics_sales_products');
    }
}