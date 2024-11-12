<?php

namespace App;

use DateTime;

class User {
    private $email;
    private $firstname;
    private $lastname;
    private $password;
    private $birthDate;

    public function __construct($email, $firstname, $lastname, $password, $birthDate) {
        $this->email = $email;
        $this->firstname = $firstname;
        $this->lastname = $lastname;
        $this->password = $password;
        $this->birthDate = new DateTime($birthDate);
    }

    public function isValid() {
        // Vérification du format de l'email
        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        // Vérification de la présence du firstname et lastname
        if (empty($this->firstname) || empty($this->lastname)) {
            return false;
        }

        // Vérification de la complexité du mot de passe
        if (strlen($this->password) < 8 || strlen($this->password) > 40 ||
            !preg_match('/[a-z]/', $this->password) || 
            !preg_match('/[A-Z]/', $this->password) || 
            !preg_match('/[0-9]/', $this->password)) {
            return false;
        }

        // Vérification de l'âge (minimum 13 ans)
        $now = new DateTime();
        $age = $now->diff($this->birthDate)->y;
        return $age >= 13;
    }

    public function getEmail() {
        return $this->email;
    }
}
