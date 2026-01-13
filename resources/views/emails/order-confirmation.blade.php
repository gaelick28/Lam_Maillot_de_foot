<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de commande</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px 20px;
        }
        .success-badge {
            background-color: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            display: inline-block;
            margin: 20px 0;
            font-weight: bold;
        }
        .order-number {
            background-color: #3b82f6;
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
        }
        .order-number strong {
            font-size: 20px;
            display: block;
            margin-top: 5px;
        }
        .section {
            margin: 20px 0;
            padding: 20px;
            background-color: #f9fafb;
            border-radius: 8px;
        }
        .section h2 {
            margin-top: 0;
            color: #1f2937;
            font-size: 18px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
        }
        .item {
            padding: 15px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .item:last-child {
            border-bottom: none;
        }
        .item-name {
            font-weight: bold;
            color: #1f2937;
        }
        .item-details {
            color: #6b7280;
            font-size: 14px;
            margin-top: 5px;
        }
        .item-personalization {
            color: #3b82f6;
            font-size: 14px;
            font-weight: 500;
            margin-top: 5px;
        }
        .total-section {
            margin: 20px 0;
            padding: 20px;
            background-color: #eff6ff;
            border-radius: 8px;
        }
        .total-line {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
        }
        .total-line.final {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            border-top: 2px solid #3b82f6;
            padding-top: 15px;
            margin-top: 10px;
        }
        .address-box {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
        }
        .address-box h3 {
            margin: 0 0 10px 0;
            color: #1f2937;
            font-size: 16px;
        }
        .footer {
            background-color: #1f2937;
            color: #9ca3af;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
        }
        .info-box {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>✓ Commande Confirmée</h1>
            <p style="margin: 10px 0 0 0;">Merci pour votre achat !</p>
        </div>

        <!-- Content -->
        <div class="content">
            <p>Bonjour <strong>{{ $user->username }}</strong>,</p>
            
            <div class="success-badge">
                ✓ Votre commande a été validée avec succès !
            </div>

            <p>Nous avons bien reçu votre commande et nous la préparons avec soin.</p>

            <!-- Numéro de commande -->
            <div class="order-number">
                <span>Numéro de commande</span>
                <strong>{{ $orderNumber }}</strong>
            </div>

            <!-- Informations de commande -->
            <div class="section">
                <h2>Détails de votre commande</h2>
                <div class="total-line">
                    <span>Date de commande :</span>
                    <strong>{{ $orderDate }}</strong>
                </div>
                <div class="total-line">
                    <span>Mode de paiement :</span>
                    <strong>{{ $paymentMethod }}</strong>
                </div>
                <div class="total-line">
                    <span>Statut du paiement :</span>
                    <strong style="color: #10b981;">✓ Payé</strong>
                </div>
            </div>

            <!-- Articles commandés -->
            <div class="section">
                <h2>Articles commandés</h2>
                @foreach($items as $item)
                <div class="item">
                    <div class="item-name">{{ $item->maillot_name }}</div>
                    @if($item->club_name)
                    <div class="item-details">Club : {{ $item->club_name }}</div>
                    @endif
                    <div class="item-details">
                        Taille : {{ $item->size }} • Quantité : {{ $item->quantity }} • 
                        Prix unitaire : {{ number_format($item->unit_price, 2, ',', ' ') }} €
                    </div>
                    @if($item->numero || $item->nom)
                    <div class="item-personalization">
                        Personnalisation : 
                        @if($item->numero)N°{{ $item->numero }}@endif
                        @if($item->numero && $item->nom) - @endif
                        @if($item->nom){{ strtoupper($item->nom) }}@endif
                    </div>
                    @endif
                    <div class="item-details">
                        <strong>Sous-total : {{ number_format($item->subtotal, 2, ',', ' ') }} €</strong>
                    </div>
                </div>
                @endforeach
            </div>

            <!-- Total -->
            <div class="total-section">
                <div class="total-line">
                    <span>Sous-total :</span>
                    <span>{{ number_format($order->subtotal, 2, ',', ' ') }} €</span>
                </div>
                <div class="total-line">
                    <span>Frais de livraison :</span>
                    <span style="color: #10b981;">
                        @if($order->shipping_cost == 0)
                            Gratuit
                        @else
                            {{ number_format($order->shipping_cost, 2, ',', ' ') }} €
                        @endif
                    </span>
                </div>
                <div class="total-line final">
                    <span>TOTAL PAYÉ :</span>
                    <span style="color: #3b82f6;">{{ $totalAmount }} €</span>
                </div>
            </div>

            <!-- Adresses -->
            @if($shippingAddress)
            <div class="section">
                <h2>Adresse de livraison</h2>
                <div class="address-box">
                    <strong>{{ $shippingAddress->first_name }} {{ $shippingAddress->last_name }}</strong><br>
                    {{ $shippingAddress->street }}<br>
                    {{ $shippingAddress->postal_code }} {{ $shippingAddress->city }}<br>
                    {{ $shippingAddress->country }}
                </div>
            </div>
            @endif

            @if($billingAddress)
            <div class="section">
                <h2>Adresse de facturation</h2>
                <div class="address-box">
                    <strong>{{ $billingAddress->first_name }} {{ $billingAddress->last_name }}</strong><br>
                    {{ $billingAddress->street }}<br>
                    {{ $billingAddress->postal_code }} {{ $billingAddress->city }}<br>
                    {{ $billingAddress->country }}
                </div>
            </div>
            @endif

            <!-- Info box -->
            <div class="info-box">
                <strong>📦 Que se passe-t-il ensuite ?</strong><br>
                Votre commande est en cours de préparation. Vous recevrez un email de confirmation d'expédition avec un numéro de suivi dès que votre colis sera parti.
            </div>

            <!-- Bouton -->
            <div style="text-align: center;">
                <a href="{{ url('/order') }}" class="button">
                    Voir mes commandes
                </a>
            </div>

            <p style="margin-top: 30px;">
                Si vous avez des questions concernant votre commande, n'hésitez pas à nous contacter.
            </p>

            <p style="margin-top: 20px;">
                Merci de votre confiance,<br>
                <strong>L'équipe Lam Maillot de Foot</strong>
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Cet email a été envoyé à {{ $user->email }}</p>
            <p>© {{ date('Y') }} Lam Maillot de Foot. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>