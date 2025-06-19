<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductVariantsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('product_id'); // product_id INT
            $table->string('name', 100); // name VARCHAR(100)
            $table->decimal('price', 10, 2); // price DECIMAL(10,2)
            $table->string('unit', 20)->nullable(); // unit VARCHAR(20)
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
        Schema::dropIfExists('product_variants');
    }
}