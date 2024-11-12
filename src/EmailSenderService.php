<?php

namespace App;

class EmailSenderService {
    public static function sendEmail($to, $message) {
        // Mock : Imiter l'envoi d'un email
        echo "Email sent to $to: $message\n";
    }
}
