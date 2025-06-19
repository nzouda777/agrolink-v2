<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('product_id'); // product_id INT
            $table->unsignedBigInteger('user_id'); // user_id INT
            $table->integer('rating'); // rating INT
            $table->string('title', 255)->nullable(); // title VARCHAR(255)
            $table->text('content')->nullable(); // content TEXT
            $table->boolean('verified_purchase')->default(false); // verified_purchase TINYINT(1)
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
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
        Schema::dropIfExists('reviews');
    }
}