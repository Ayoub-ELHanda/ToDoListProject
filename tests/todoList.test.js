const UserValidator = require('../src/models/UserValidator');
const ToDoList = require('../src/models/ToDoList');
const EmailSenderService = require('../src/services/EmailSenderService');

// Mocking the EmailSenderService to avoid actual email sending
jest.mock('../src/services/EmailSenderService.js');

describe('ToDoList Tests', () => {
  let user;
  let todoList;

  beforeEach(() => {
    // Creating a valid user for each test
    user = {
      email: 'example@mail.com',
      firstname: 'John',
      lastname: 'Doe',
      password: 'Password123',
      birthdate: '2010-01-01' // User is 14 years old (valid)
    };

    // Creating a new ToDoList instance
    todoList = new ToDoList(user);
  });

  test('should validate a user correctly', () => {
    expect(UserValidator.isValid(user)).toBe(true);
  });

  test('should add an item to ToDoList', () => {
    const item = {
      name: 'Item 1',
      content: 'Contenu de l\'item',
      creationDate: new Date().toISOString()
    };

    todoList.add(item);

    expect(todoList.items.length).toBe(1);
    expect(todoList.items[0].name).toBe('Item 1');
  });

  test('should not allow more than 10 items in ToDoList', () => {
    // Adding 10 items with a 30-minute interval between each
    for (let i = 0; i < 10; i++) {
      const item = {
        name: `Item ${i + 1}`,
        content: 'Contenu de l\'item',
        creationDate: new Date(new Date().getTime() + i * 30 * 60000).toISOString() // 30 minutes apart
      };
      todoList.add(item);
    }

    // Verify there are exactly 10 items
    expect(todoList.items.length).toBe(10);

    // Try to add the 11th item, which should fail
    const newItem = {
      name: 'Item 11',
      content: 'Contenu de l\'item',
      creationDate: new Date().toISOString()
    };

    expect(() => todoList.add(newItem)).toThrow('La ToDoList est pleine');
  });

  test('should send email when 8th item is added', () => {
    // Adding 7 items with a 30-minute interval
    for (let i = 0; i < 7; i++) {
      const item = {
        name: `Item ${i + 1}`,
        content: 'Contenu de l\'item',
        creationDate: new Date(new Date().getTime() + i * 30 * 60000).toISOString()
      };
      todoList.add(item);
    }

    // Adding the 8th item
    const eighthItem = {
      name: 'Item 8',
      content: 'Contenu de l\'item',
      creationDate: new Date(new Date().getTime() + 7 * 30 * 60000).toISOString()
    };

    todoList.add(eighthItem);

    // Verifying that the email was sent
    expect(EmailSenderService.sendEmail).toHaveBeenCalledWith(
      user.email,
      'Votre ToDoList est presque pleine'
    );
  });

  test('should throw an error if adding item too quickly (less than 30 minutes)', () => {
    const firstItem = {
      name: 'Item 1',
      content: 'Contenu de l\'item',
      creationDate: new Date().toISOString()
    };
    
    todoList.add(firstItem);

    // Adding a second item too quickly (less than 30 minutes apart)
    const secondItem = {
      name: 'Item 2',
      content: 'Contenu de l\'item',
      creationDate: new Date(new Date().getTime() + 1000 * 60 * 5).toISOString() // 5 minutes later
    };

    expect(() => todoList.add(secondItem)).toThrow('Il doit y avoir une période de 30 minutes entre deux items');
  });

  test('should throw error if user is invalid', () => {
    // Making the user invalid by changing their email and other properties
    const invalidUser = {
      email: 'invalid-email',  // Invalid email format
      firstname: '',            // Invalid name
      lastname: '',             // Invalid name
      password: 'short',        // Invalid password (too short)
      birthdate: '2010-01-01'   // Valid birthdate, but other fields are invalid
    };

    // Trying to create a ToDoList with an invalid user should throw an error
    expect(() => new ToDoList(invalidUser)).toThrow('Utilisateur non valide');
  });

  test('should throw error when save is called', () => {
    const item = {
      name: 'Item 1',
      content: 'Contenu de l\'item',
      creationDate: new Date().toISOString()
    };

    expect(() => todoList.save(item)).toThrow('Erreur lors de l\'enregistrement de l\'item');
  });
});
