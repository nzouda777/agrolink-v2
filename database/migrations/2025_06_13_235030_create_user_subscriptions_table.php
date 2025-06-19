<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserSubscriptionsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_subscriptions', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('user_id'); // user_id INT
            $table->unsignedBigInteger('subscription_id'); // subscription_id INT
            $table->timestamp('start_date'); // start_date TIMESTAMP
            $table->timestamp('end_date')->nullable(); // end_date TIMESTAMP
            $table->enum('status', ['active', 'inactive', 'cancelled', 'expired']); // status ENUM
            $table->string('payment_method', 50)->nullable(); // payment_method VARCHAR(50)
            $table->timestamp('created_at')->nullable(); // created_at TIMESTAMP
            $table->timestamp('updated_at')->nullable(); // updated_at TIMESTAMP

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('subscription_id')->references('id')->on('subscriptions')->onDelete('cascade');
        });
    }

    /**
     * Annule les migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_subscriptions');
    }
}