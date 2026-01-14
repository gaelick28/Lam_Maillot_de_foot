<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau message de contact</title>
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
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
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
        .info-box {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info-box h3 {
            margin: 0 0 10px 0;
            color: #1e40af;
            font-size: 16px;
        }
        .info-box p {
            margin: 5px 0;
            color: #1e3a8a;
        }
        .message-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .message-box h3 {
            margin: 0 0 15px 0;
            color: #1f2937;
            font-size: 18px;
        }
        .message-content {
            color: #374151;
            line-height: 1.8;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .footer {
            background-color: #1f2937;
            color: #9ca3af;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
        .badge {
            display: inline-block;
            padding: 5px 12px;
            background-color: #dbeafe;
            color: #1e40af;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            margin: 10px 0;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>📧 Nouveau message de contact</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Reçu le {{ $sentAt }}</p>
        </div>

        <!-- Content -->
        <div class="content">
            <p>Bonjour,</p>
            <p>Vous avez reçu un nouveau message depuis le formulaire de contact du site Fou2Foot.</p>

            <!-- Informations de l'expéditeur -->
            <div class="info-box">
                <h3>📋 Informations de l'expéditeur</h3>
                <p><strong>Nom :</strong> {{ $name }}</p>
                <p><strong>Email :</strong> <a href="mailto:{{ $email }}" style="color: #2563eb;">{{ $email }}</a></p>
                <p><strong>Sujet :</strong> <span class="badge">{{ $subject }}</span></p>
            </div>

            <!-- Message -->
            <div class="message-box">
                <h3>💬 Message</h3>
                <div class="message-content">{{ $messageContent }}</div>
            </div>

            <div class="divider"></div>

            <p style="margin-top: 20px;">
                <strong>💡 Comment répondre :</strong><br>
                Cliquez simplement sur "Répondre" dans votre client email. L'adresse de réponse est automatiquement configurée sur l'email de l'expéditeur.
            </p>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Ce message a été envoyé via le formulaire de contact du site Fou2Foot.<br>
                Date d'envoi : {{ $sentAt }}
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>© {{ date('Y') }} Fou2Foot. Tous droits réservés.</p>
            <p>Cet email a été envoyé à l'équipe de support.</p>
        </div>
    </div>
</body>
</html>