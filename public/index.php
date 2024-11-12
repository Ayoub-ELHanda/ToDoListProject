<?php

require_once '../vendor/autoload.php';

use App\User;
use App\Item;
use App\ToDoList;
use App\EmailSenderService;

try {
    // Création d'un utilisateur valide
    $user = new User("test@example.com", "John", "Doe", "Password123", "2000-01-01");

    // Création de la ToDoList
    $todoList = new ToDoList($user);

    // Ajout d'éléments
    $item1 = new Item("Task 1", "First task content.");
    $todoList->addItem($item1);

    $item2 = new Item("Task 2", "Second task content.");
    $todoList->addItem($item2);

    // Sauvegarde (provoque une exception simulée)
    $todoList->save();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
