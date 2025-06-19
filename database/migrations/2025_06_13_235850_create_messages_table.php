<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessagesTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('conversation_id'); // conversation_id INT
            $table->unsignedBigInteger('sender_id'); // sender_id INT
            $table->text('content'); // content TEXT
            $table->boolean('is_read')->default(false); // is_read TINYINT(1)
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            $table->foreign('conversation_id')->references('id')->on('conversations')->onDelete('cascade');
            $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Annule les migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('messages');
    }
}