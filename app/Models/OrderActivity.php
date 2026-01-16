<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_id',
        'type',
        'old_status',
        'new_status',
        'message',
        'details',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public static function recordStatusChange($order, $oldStatus, $newStatus)
    {
        $statusLabels = [
            'pending' => 'En attente',
            'shipped' => 'Expédiée',
            'delivered' => 'Livrée',
            'cancelled' => 'Annulée',
        ];

        $message = match($newStatus) {
            'shipped' => "Votre commande a été expédiée",
            'delivered' => "Votre commande a été livrée",
            'cancelled' => "Votre commande a été annulée",
            default => "Statut de commande mis à jour : {$statusLabels[$newStatus]}"
        };

        return self::create([
            'user_id' => $order->user_id,
            'order_id' => $order->id,
            'type' => 'order',
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'message' => $message,
            'details' => $order->order_number,
        ]);
    }
}