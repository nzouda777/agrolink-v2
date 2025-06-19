<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentMethodsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('user_id'); // user_id INT
            $table->enum('type', ['credit_card', 'paypal', 'bank_transfer', 'other']); // type ENUM
            $table->string('provider', 100)->nullable(); // provider VARCHAR(100)
            $table->string('account_number', 100)->nullable(); // account_number VARCHAR(100)
            $table->boolean('is_default')->default(false); // is_default TINYINT(1)
            $table->enum('status', ['active', 'inactive', 'suspended']); // status ENUM
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Annule les migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payment_methods');
    }
}