<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('user_id'); // user_id INT
            $table->string('type', 50); // type VARCHAR(50)
            $table->text('content'); // content TEXT
            $table->boolean('is_read')->default(false); // is_read TINYINT(1)
            $table->timestamp('created_at')->nullable(); // created_at TIMESTAMP
            $table->timestamp('updated_at')->nullable(); // updated_at TIMESTAMP

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
        Schema::dropIfExists('notifications');
    }
}