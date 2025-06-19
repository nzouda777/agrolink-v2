<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('buyer_id'); // buyer_id INT
            $table->unsignedBigInteger('status_id'); // status_id INT
            $table->enum('action_type', ['purchase', 'sale', 'return']); // action_type ENUM
            $table->decimal('total_price', 10, 2); // total_price DECIMAL(10,2)
            $table->decimal('shipping_fee', 10, 2)->default(0.00); // shipping_fee DECIMAL(10,2)
            $table->decimal('tax_amount', 10, 2)->default(0.00); // tax_amount DECIMAL(10,2)
            $table->string('payment_method', 50)->nullable(); // payment_method VARCHAR(50)
            $table->text('shipping_address')->nullable(); // shipping_address TEXT
            $table->text('billing_address')->nullable(); // billing_address TEXT
            $table->text('notes')->nullable(); // notes TEXT
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            $table->foreign('buyer_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('status_id')->references('id')->on('order_statuses')->onDelete('cascade');
        });
    }

    /**
     * Annule les migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}