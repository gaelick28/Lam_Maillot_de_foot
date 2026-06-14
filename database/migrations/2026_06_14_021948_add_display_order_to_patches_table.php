<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('patches', function (Blueprint $table) {
        $table->integer('display_order')->default(99)->after('prix');
    });
    DB::table('patches')->whereIn('id', [10, 13, 14, 15, 16])->update(['display_order' => 1]);
    DB::table('patches')->where('id', 11)->update(['display_order' => 2]);
    DB::table('patches')->where('id', 12)->update(['display_order' => 3]);
    DB::table('patches')->where('id', 18)->update(['display_order' => 4]);
    DB::table('patches')->whereIn('id', [17, 19, 20])->update(['display_order' => 5]);
}

public function down()
{
    Schema::table('patches', function (Blueprint $table) {
        $table->dropColumn('display_order');
    });
}
};
