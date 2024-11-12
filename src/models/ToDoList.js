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

    // Send email when 8th item is added
    if (this.items.length === 8) {
      EmailSenderService.sendEmail(this.user.email, 'Votre ToDoList est presque pleine');
    }
  }

  save(item) {
    // Mock save function to just throw an error
    throw new Error('Erreur lors de l\'enregistrement de l\'item');
  }
}

module.exports = ToDoList;
