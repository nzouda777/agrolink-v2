<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserSessionsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_sessions', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('user_id'); // user_id INT
            $table->string('token', 255)->unique(); // token VARCHAR(255)
            $table->string('ip_address', 45)->nullable(); // ip_address VARCHAR(45)
            $table->text('user_agent')->nullable(); // user_agent TEXT
            $table->timestamp('last_activity')->nullable(); // last_activity TIMESTAMP
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            // Foreign key
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
        Schema::dropIfExists('user_sessions');
    }
}