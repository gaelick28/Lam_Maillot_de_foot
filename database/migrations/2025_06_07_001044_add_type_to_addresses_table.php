<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            //
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            //
        });
    }
};


// // database/migrations/xxxx_xx_xx_add_type_to_addresses_table.php

// return new class extends Migration
// {
//     /**
//      * Run the migrations.
//      */
//     public function up()
//     {
//         Schema::table('addresses', function (Blueprint $table) {
//             $table->string('type')->default('shipping'); // 'billing' ou 'shipping'
//         });
//     }

//     /**
//      * Reverse the migrations.
//      */
//     public function down()
//     {
//         Schema::table('addresses', function (Blueprint $table) {
//             $table->dropColumn('type');
//         });
//     }
// };
