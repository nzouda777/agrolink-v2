<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnalyticsSalesTable extends Migration
{
    public function up()
    {
        Schema::create('analytics_sales', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique();
            $table->decimal('total_sales', 10, 2)->default(0.00);
            $table->integer('order_count')->default(0);
            $table->integer('customer_count')->default(0);
            $table->decimal('avg_order_value', 10, 2)->default(0.00);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('analytics_sales');
    }
}