const fs = require('fs');
const path = require('path');
const EmailSenderService = require('../services/EmailSenderService');
const UserValidator = require('../models/UserValidator');

class ToDoList {
  constructor(user) {
    if (!UserValidator.isValid(user)) {
      throw new Error('Utilisateur non valide');
    }
    this.user = user;
    this.items = [];
  }

  add(item) {
    if (this.items.length >= 10) {
      throw new Error('La ToDoList est pleine');
    }

    if (this.items.length > 0) {
      const lastItemDate = new Date(this.items[this.items.length - 1].creationDate);
      const newItemDate = new Date(item.creationDate);
      const timeDiff = (newItemDate - lastItemDate) / 60000;

      if (timeDiff < 30) {
        throw new Error('Il doit y avoir une période de 30 minutes entre deux items');
      }
    }

    this.items.push(item);

    // Sauvegarde l'élément dans le fichier JSON
    this.save(item);

    // Envoie un email lorsque le 8ème élément est ajouté
    if (this.items.length === 8) {
      EmailSenderService.sendEmail(this.user.email, 'Votre ToDoList est presque pleine');
    }
  }

  save(item) {
    const filePath = path.join(__dirname, 'todoList.json');

    // Initialiser la structure de todoLists avec un tableau vide si le fichier n'existe pas ou est vide
    let todoLists = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      if (fileData) {
        try {
          todoLists = JSON.parse(fileData);
        } catch (error) {
          console.error("Erreur de parsing du fichier JSON", error);
          todoLists = [];
        }
      }
    }

    // Vérifie si l'utilisateur existe déjà dans la liste, sinon on le crée
    const userIndex = todoLists.findIndex(entry => entry.user.email === this.user.email);

    if (userIndex === -1) {
      // Si l'utilisateur n'existe pas, on le rajoute avec la première tâche
      todoLists.push({ user: this.user, items: [item] });
    } else {
      // Si l'utilisateur existe, on ajoute la tâche à sa liste d'éléments
      todoLists[userIndex].items.push(item);
    }

    // Sauvegarder les données modifiées dans le fichier JSON
    fs.writeFileSync(filePath, JSON.stringify(todoLists, null, 2), 'utf-8');
  }
}

module.exports = ToDoList;
