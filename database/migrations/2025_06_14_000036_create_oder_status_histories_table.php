<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderStatusHistoriesTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_status_histories', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('order_id'); // order_id INT
            $table->unsignedBigInteger('status_id'); // status_id INT
            $table->unsignedBigInteger('user_id')->nullable(); // user_id INT
            $table->text('notes')->nullable(); // notes TEXT
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('status_id')->references('id')->on('order_statuses')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Annule les migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('order_status_histories');
    }
}