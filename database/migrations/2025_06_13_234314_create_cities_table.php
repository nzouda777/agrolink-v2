<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCitiesTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cities', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('region_id'); // region_id INT
            $table->string('name', 100); // name VARCHAR(100)
            $table->decimal('latitude', 10, 8)->nullable(); // latitude DECIMAL(10,8)
            $table->decimal('longitude', 11, 8)->nullable(); // longitude DECIMAL(11,8)
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            // Foreign key
            $table->foreign('region_id')->references('id')->on('regions')->onDelete('cascade');
        });
    }

    /**
     * Annule les migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cities');
    }
}