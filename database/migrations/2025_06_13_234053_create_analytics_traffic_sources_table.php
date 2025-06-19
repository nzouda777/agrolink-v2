<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnalyticsTrafficSourcesTable extends Migration
{
    public function up()
    {
        Schema::create('analytics_traffic_sources', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('traffic_id')->nullable();
            $table->string('source', 100);
            $table->integer('visits')->default(0);
            $table->integer('unique_visitors')->default(0);
            $table->integer('page_views')->default(0);
            $table->decimal('bounce_rate', 5, 2)->default(0.00);
            $table->decimal('avg_session_duration', 10, 2)->default(0.00);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('analytics_traffic_sources');
    }
}