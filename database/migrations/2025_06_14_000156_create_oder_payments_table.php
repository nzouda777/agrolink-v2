<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderPaymentsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_payments', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('order_id'); // order_id INT
            $table->string('transaction_id', 100); // transaction_id VARCHAR(100)
            $table->string('provider', 50); // provider VARCHAR(50)
            $table->decimal('total_amount', 10, 2); // total_amount DECIMAL(10,2)
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded']); // status ENUM
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });
    }

    /**
     * Annule les migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('order_payments');
    }
}