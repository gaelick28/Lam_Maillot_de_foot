<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Order;

class OrderConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $user;

    /**
     * Create a new message instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
        $this->user = $order->user;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Confirmation de commande - ' . $this->order->order_number)
            ->view('emails.order-confirmation')
            ->with([
                'orderNumber' => $this->order->order_number,
                'orderDate' => $this->order->created_at->format('d/m/Y à H:i'),
                'totalAmount' => number_format($this->order->total_amount, 2, ',', ' '),
                'paymentMethod' => $this->order->payment_method_label,
                'items' => $this->order->items,
                'shippingAddress' => $this->order->shippingAddress,
                'billingAddress' => $this->order->billingAddress,
            ]);
    }
}