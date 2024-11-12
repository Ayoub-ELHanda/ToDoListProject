const UserValidator = require('./models/UserValidator');
const ToDoList = require('./models/ToDoList');
const EmailSenderService = require('./services/EmailSenderService');

const user = {
  email: 'elhandaayo@gmail.com',
  firstname: 'ayoub',
  lastname: 'elhanda',
  password: 'Test1213',  // Updated password
  birthdate: '2000-01-16'
};

if (UserValidator.isValid(user)) {
  const todoList = new ToDoList(user);

  try {
    for (let i = 0; i < 10; i++) {
      const item = {
        name: `Item ${i + 1}`,
        content: 'Contenu de l\'item',
        creationDate: new Date().toISOString(),
      };
      todoList.add(item);
      console.log(`Item ${i + 1} ajouté avec succès`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'item:', error.message);
  }
} else {
  console.log('L\'utilisateur n\'est pas valide');
}
