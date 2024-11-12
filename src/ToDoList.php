<?php

namespace App;

use DateTime;

class ToDoList {
    private $user;
    private $items;

    public function __construct($user) {
        if (!$user->isValid()) {
            throw new \Exception("User is not valid");
        }
        $this->user = $user;
        $this->items = [];
    }

    public function addItem($item) {
        if (count($this->items) >= 10) {
            throw new \Exception("Cannot add more than 10 items to the ToDoList");
        }

        // Vérification de la période de 30 minutes entre les créations
        if (!empty($this->items)) {
            $lastItemDate = end($this->items)->getCreationDate();
            $now = new DateTime();
            $interval = $lastItemDate->diff($now);
            $minutesSinceLastItem = $interval->i + ($interval->h * 60);

            if ($minutesSinceLastItem < 30) {
                throw new \Exception("You must wait at least 30 minutes before adding a new item");
            }
        }

        $this->items[] = $item;

        // Notification pour le 8ème élément
        if (count($this->items) == 8) {
            EmailSenderService::sendEmail($this->user->getEmail(), "Your ToDoList is almost full!");
        }
    }

    public function save() {
        // Simule une méthode qui lève une exception
        throw new \Exception("Save method not implemented");
    }
}
