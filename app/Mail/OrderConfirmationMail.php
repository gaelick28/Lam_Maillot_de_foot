<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Order;
use App\Models\Patch;

class OrderConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $user;

    public function __construct(Order $order)
    {
        $this->order = $order;
        $this->user  = $order->user;
    }

    public function build()
    {
        // Résoudre les noms de patches une seule fois pour tous les items
        $allPatches = Patch::all()->keyBy('id');

        $items = $this->order->items->map(function ($item) use ($allPatches) {
            $patchIds   = $item->patches ?? [];
            $patchNames = collect($patchIds)
                ->map(fn($id) => $allPatches[$id]?->nom)
                ->filter()
                ->values()
                ->toArray();

            return array_merge($item->toArray(), [
                'patch_names' => $patchNames,
            ]);
        });

        return $this->subject('Confirmation de commande - ' . $this->order->order_number)
            ->view('emails.order-confirmation')
            ->with([
                'orderNumber'     => $this->order->order_number,
                'orderDate'       => $this->order->created_at->format('d/m/Y à H:i'),
                'totalAmount'     => number_format($this->order->total_amount, 2, ',', ' '),
                'paymentMethod'   => $this->order->payment_method_label,
                'items'           => $items,
                'shippingAddress' => $this->order->shippingAddress,
                'billingAddress'  => $this->order->billingAddress,
            ]);
    }
}