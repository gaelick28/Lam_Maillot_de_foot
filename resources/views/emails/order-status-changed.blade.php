<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mise à jour de votre commande</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 28px;
        }
        .email-body {
            padding: 30px 20px;
        }
        .status-badge {
            display: inline-block;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
        }
        .status-shipped {
            background-color: #3b82f6;
            color: #ffffff;
        }
        .status-delivered {
            background-color: #10b981;
            color: #ffffff;
        }
        .status-cancelled {
            background-color: #ef4444;
            color: #ffffff;
        }
        .status-pending {
            background-color: #f59e0b;
            color: #ffffff;
        }
        .order-info {
            background-color: #f8fafc;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .order-info p {
            margin: 8px 0;
            color: #334155;
        }
        .order-info strong {
            color: #1e293b;
        }
        .message-box {
            background-color: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .message-box p {
            margin: 0;
            color: #1e40af;
            line-height: 1.6;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .cta-button:hover {
            opacity: 0.9;
        }
        .email-footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
        }
        .email-footer a {
            color: #667eea;
            text-decoration: none;
        }
        .divider {
            height: 1px;
            background-color: #e2e8f0;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <h1>🛍️ Fou2Foot</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Mise à jour de votre commande</p>
        </div>

        <!-- Body -->
        <div class="email-body">
            <h2 style="color: #1e293b; margin-top: 0;">Bonjour {{ $order->user->username }} !</h2>

            <!-- Message principal selon le statut -->
            @if($newStatus === 'shipped')
                <div class="message-box">
                    <p>
                        📦 <strong>Bonne nouvelle !</strong> Votre commande a été expédiée et est en route vers vous.
                        Vous devriez la recevoir sous 2 à 4 jours ouvrables.
                    </p>
                </div>
            @elseif($newStatus === 'delivered')
                <div class="message-box" style="background-color: #f0fdf4; border-color: #86efac;">
                    <p style="color: #15803d;">
                        ✅ <strong>Excellente nouvelle !</strong> Votre commande a été livrée avec succès.
                        Nous espérons que vous apprécierez vos nouveaux maillots !
                    </p>
                </div>
            @elseif($newStatus === 'cancelled')
                <div class="message-box" style="background-color: #fef2f2; border-color: #fca5a5;">
                    <p style="color: #991b1b;">
                        ❌ Votre commande a été annulée. Si vous n'êtes pas à l'origine de cette annulation,
                        veuillez nous contacter immédiatement.
                    </p>
                </div>
            @else
                <p>Le statut de votre commande a été mis à jour.</p>
            @endif

            <!-- Informations de la commande -->
            <div class="order-info">
                <p><strong>📋 Numéro de commande :</strong> {{ $order->order_number }}</p>
                <p><strong>📅 Date de commande :</strong> {{ $order->created_at->format('d/m/Y à H:i') }}</p>
                <p><strong>💰 Montant total :</strong> {{ number_format($order->total_amount, 2, ',', ' ') }} €</p>
                <p>
                    <strong>📊 Statut :</strong>
                    <span class="status-badge status-{{ $newStatus }}">
                        {{ $statusLabels[$newStatus] }}
                    </span>
                </p>
            </div>

            <!-- Informations de livraison si expédiée -->
            @if($newStatus === 'shipped' && $order->shippingAddress)
                <div class="divider"></div>
                <h3 style="color: #1e293b;">📍 Adresse de livraison</h3>
                <p style="color: #475569; line-height: 1.8;">
                    {{ $order->shippingAddress->first_name }} {{ $order->shippingAddress->last_name }}<br>
                    {{ $order->shippingAddress->street }}<br>
                    @if($order->shippingAddress->address_complement)
                        {{ $order->shippingAddress->address_complement }}<br>
                    @endif
                    {{ $order->shippingAddress->postal_code }} {{ $order->shippingAddress->city }}<br>
                    {{ $order->shippingAddress->country }}
                </p>
            @endif

            <div class="divider"></div>

            <!-- Bouton d'action -->
            <div style="text-align: center;">
                <a href="{{ url('/order') }}" class="cta-button">
                    Voir mes commandes
                </a>
            </div>

            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 20px;">
                Vous pouvez suivre l'état de votre commande à tout moment depuis votre compte.
            </p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p>
                <strong>Fou2Foot</strong><br>
                La passion du football, la qualité des maillots
            </p>
            <p style="margin-top: 15px;">
                <a href="{{ url('/') }}">Visiter notre site</a> •
                <a href="{{ url('/contact') }}">Nous contacter</a> •
                <a href="{{ url('/legal') }}">Mentions légales</a>
            </p>
            <p style="margin-top: 15px; font-size: 12px; color: #94a3b8;">
                Vous recevez cet email car vous avez passé une commande sur Fou2Foot.<br>
                Cet email est envoyé automatiquement, merci de ne pas y répondre.
            </p>
        </div>
    </div>
</body>
</html>