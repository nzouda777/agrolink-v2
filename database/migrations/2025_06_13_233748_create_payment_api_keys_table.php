<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentApiKeysTable extends Migration
{
    public function up()
    {
        Schema::create('payment_api_keys', function (Blueprint $table) {
            $table->id();
            $table->string('provider', 100);
            $table->string('api_key', 255);
            $table->string('api_secret', 255)->nullable();
            $table->boolean('is_live')->default(false);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('payment_api_keys');
    }
}