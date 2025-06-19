<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModerationActionsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('moderation_actions', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('report_id'); // report_id INT
            $table->unsignedBigInteger('moderator_id'); // moderator_id INT
            $table->string('action_taken', 255); // action_taken VARCHAR(255)
            $table->text('notes')->nullable(); // notes TEXT
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            $table->foreign('report_id')->references('id')->on('moderation_reports')->onDelete('cascade');
            $table->foreign('moderator_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Annule les migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('moderation_actions');
    }
}