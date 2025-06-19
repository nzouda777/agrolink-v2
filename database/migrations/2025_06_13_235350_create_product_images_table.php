<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductImagesTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('product_id'); // product_id INT
            $table->string('image_url', 255); // image_url VARCHAR(255)
            $table->integer('sort_order')->default(0); // sort_order INT
            $table->timestamps(); // created_at and updated_at TIMESTAMP

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
        Schema::dropIfExists('product_images');
    }
}