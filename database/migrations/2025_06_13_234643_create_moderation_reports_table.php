<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModerationReportsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('moderation_reports', function (Blueprint $table) {
            $table->id(); // id INT
            $table->enum('entity_type', ['product', 'review', 'user', 'message', 'other']); // entity_type ENUM
            $table->unsignedBigInteger('entity_id'); // entity_id INT
            $table->unsignedBigInteger('reporter_id'); // reporter_id INT
            $table->string('reason', 100); // reason VARCHAR(100)
            $table->text('details')->nullable(); // details TEXT
            $table->enum('status', ['pending', 'reviewed', 'resolved', 'rejected']); // status ENUM
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            $table->foreign('reporter_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Annule les migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('moderation_reports');
    }
}