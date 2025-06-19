<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoryTranslationsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('category_translations', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('category_id'); // category_id INT
            $table->string('locale', 10); // locale VARCHAR(10)
            $table->string('name', 100); // name VARCHAR(100)
            $table->text('description')->nullable(); // description TEXT
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            $table->unique(['category_id', 'locale']);
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
        Schema::dropIfExists('category_translations');
    }
}