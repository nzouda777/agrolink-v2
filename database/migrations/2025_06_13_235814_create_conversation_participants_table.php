<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConversationParticipantsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('conversation_participants', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('conversation_id'); // conversation_id INT
            $table->unsignedBigInteger('user_id'); // user_id INT
            $table->timestamp('last_read_at')->nullable(); // last_read_at TIMESTAMP
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            $table->unique(['conversation_id', 'user_id']);
            $table->foreign('conversation_id')->references('id')->on('conversations')->onDelete('cascade');
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
        Schema::dropIfExists('conversation_participants');
    }
}