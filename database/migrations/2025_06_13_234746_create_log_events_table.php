<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLogEventsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('log_events', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('user_id')->nullable(); // user_id INT
            $table->string('event_type', 100); // event_type VARCHAR(100)
            $table->text('details')->nullable(); // details TEXT
            $table->string('ip_address', 45)->nullable(); // ip_address VARCHAR(45)
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Annule les migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('log_events');
    }
}