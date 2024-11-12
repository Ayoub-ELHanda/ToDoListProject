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
      const timeDiff = (newItemDate - lastItemDate) / 60000; // Difference in minutes
    
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
    let todoLists = [];
  
    try {
      // Check if the file exists and read its contents
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
  
      // Check if the user is already in the list
      const userIndex = todoLists.findIndex(entry => entry.user.email === this.user.email);
  
      if (userIndex === -1) {
        todoLists.push({ user: this.user, items: [item] });
      } else {
        todoLists[userIndex].items.push(item);
      }
  
      // Write the updated data to the file
      fs.writeFileSync(filePath, JSON.stringify(todoLists, null, 2), 'utf-8');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans le fichier:', error.message);
    }
  }
  
}

module.exports = ToDoList;
