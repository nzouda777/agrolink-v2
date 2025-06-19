<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderItemsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('order_id'); // order_id INT
            $table->unsignedBigInteger('product_id'); // product_id INT
            $table->integer('quantity'); // quantity INT
            $table->decimal('unit_price', 10, 2); // unit_price DECIMAL(10,2)
            $table->decimal('amount', 10, 2); // amount DECIMAL(10,2)
            $table->text('description')->nullable(); // description TEXT
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
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
        Schema::dropIfExists('order_items');
    }
}