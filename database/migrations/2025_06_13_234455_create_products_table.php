<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('seller_id'); // seller_id INT
            $table->unsignedBigInteger('category_id'); // category_id INT
            $table->string('name', 255); // name VARCHAR(255)
            $table->text('description')->nullable(); // description TEXT
            $table->decimal('price', 10, 2); // price DECIMAL(10,2)
            $table->decimal('old_price', 10, 2)->nullable(); // old_price DECIMAL(10,2)
            $table->string('unit', 20)->nullable(); // unit VARCHAR(20)
            $table->enum('status', ['available', 'unavailable', 'draft', 'pending_approval']); // status ENUM
            $table->boolean('featured')->default(false); // featured TINYINT(1)
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            // Foreign keys
            $table->foreign('seller_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Annule les migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}