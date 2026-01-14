<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public $contactData;

    /**
     * Create a new message instance.
     */
    public function __construct($contactData)
    {
        $this->contactData = $contactData;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Nouveau message depuis le formulaire de contact - ' . $this->contactData['subject'])
            ->replyTo($this->contactData['email'], $this->contactData['name'])
            ->view('emails.contact-form')
            ->with([
                'name' => $this->contactData['name'],
                'email' => $this->contactData['email'],
                'subject' => $this->contactData['subject'],
                'messageContent' => $this->contactData['message'],
                'sentAt' => now()->format('d/m/Y à H:i'),
            ]);
    }
}