<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Exécute les migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // id INT
            $table->string('email')->unique(); // email VARCHAR(255)
            $table->string('password_hash'); // password_hash VARCHAR(255)
            $table->string('name', 100)->nullable(); // name VARCHAR(100)
            $table->string('phone', 20)->nullable(); // phone VARCHAR(20)
            $table->unsignedBigInteger('role_id')->nullable(); // role_id INT
            $table->unsignedBigInteger('type_id')->nullable(); // type_id INT
            $table->string('profile_image', 255)->nullable(); // profile_image VARCHAR(255)
            $table->boolean('email_verified')->default(false); // email_verified TINYINT(1)
            $table->boolean('phone_verified')->default(false); // phone_verified TINYINT(1)
            $table->timestamp('last_active')->nullable(); // last_active TIMESTAMP
            $table->timestamps(); // created_at and updated_at TIMESTAMP

            // Foreign keys
            $table->foreign('role_id')->references('id')->on('user_roles')->onDelete('set null');
            $table->foreign('type_id')->references('id')->on('user_types')->onDelete('set null');
        });
    }

    /**
     * Annule les migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}