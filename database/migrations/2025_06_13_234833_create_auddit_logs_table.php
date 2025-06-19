<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAuditLogsTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id(); // id INT
            $table->unsignedBigInteger('user_id')->nullable(); // user_id INT
            $table->string('action', 255); // action VARCHAR(255)
            $table->string('table_name', 100); // table_name VARCHAR(100)
            $table->unsignedBigInteger('record_id')->nullable(); // record_id INT
            $table->json('old_values')->nullable(); // old_values JSON
            $table->json('new_values')->nullable(); // new_values JSON
            $table->timestamp('created_at')->nullable(); // created_at TIMESTAMP
            $table->timestamp('updated_at')->nullable(); // updated_at TIMESTAMP

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
        Schema::dropIfExists('audit_logs');
    }
}