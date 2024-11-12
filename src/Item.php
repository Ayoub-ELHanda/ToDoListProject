<?php

namespace App;

use DateTime;

class Item {
    private $name;
    private $content;
    private $creationDate;

    public function __construct($name, $content) {
        if (strlen($content) > 1000) {
            throw new \Exception("Content must be at most 1000 characters");
        }
        $this->name = $name;
        $this->content = $content;
        $this->creationDate = new DateTime();
    }

    public function getName() {
        return $this->name;
    }

    public function getCreationDate() {
        return $this->creationDate;
    }
}
