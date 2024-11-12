const fs = require('fs'); // Import fs to mock it
const EmailSenderService = require('../src/services/EmailSenderService');
const UserValidator = require('../src/models/UserValidator');
const ToDoList = require('../src/models/ToDoList');

// Mocking fs and EmailSenderService
jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  readFileSync: jest.fn().mockReturnValue(JSON.stringify([{ user: { email: 'example@mail.com' }, items: [] }])),
  writeFileSync: jest.fn(),
}));

jest.mock('../src/services/EmailSenderService.js'); // Mock EmailSenderService

describe('ToDoList Tests', () => {
  let user;
  let todoList;

  beforeEach(() => {
    user = {
      email: 'example@mail.com',
      firstname: 'John',
      lastname: 'Doe',
      password: 'Password123',
      birthdate: '2010-01-01' // Valid user
    };

    todoList = new ToDoList(user);
  });

  const createItem = (index) => ({
    name: `Item ${index + 1}`,
    content: 'Contenu de l\'item',
    creationDate: new Date(new Date().getTime() + index * 30 * 60000).toISOString(),
  });

  test('should validate a user correctly', () => {
    expect(UserValidator.isValid(user)).toBe(true);
  });

  test('should add an item to ToDoList', () => {
    const item = createItem(0);
    todoList.add(item);

    expect(todoList.items.length).toBe(1);
    expect(todoList.items[0].name).toBe('Item 1');
  });

  test('should not allow more than 10 items in ToDoList', () => {
    for (let i = 0; i < 10; i++) {
      todoList.add(createItem(i));
    }

    expect(todoList.items.length).toBe(10);

    const newItem = createItem(10);
    expect(() => todoList.add(newItem)).toThrow('La ToDoList est pleine');
  });

  test('should send email when 8th item is added', () => {
    for (let i = 0; i < 7; i++) {
      todoList.add(createItem(i));
    }

    todoList.add(createItem(7));

    expect(EmailSenderService.sendEmail).toHaveBeenCalledWith(
      user.email,
      'Votre ToDoList est presque pleine'
    );
  });

  test('should throw an error if adding item too quickly (less than 30 minutes)', () => {
    const firstItem = createItem(0);
    todoList.add(firstItem);

    const secondItem = {
      name: 'Item 2',
      content: 'Contenu de l\'item',
      creationDate: new Date(new Date().getTime() + 1000 * 60 * 5).toISOString(),
    };

    expect(() => todoList.add(secondItem)).toThrow('Il doit y avoir une période de 30 minutes entre deux items');
  });

  test('should throw error if user is invalid', () => {
    const invalidUser = {
      email: 'invalid-email',
      firstname: '',
      lastname: '',
      password: 'short',
      birthdate: '2010-01-01'
    };

    expect(() => {
      new ToDoList(invalidUser);
    }).toThrow('Utilisateur non valide');
  });

  test('should throw error when save is called', () => {
    const item = createItem(0);

    jest.spyOn(todoList, 'save').mockImplementationOnce(() => {
      throw new Error('Erreur lors de l\'enregistrement de l\'item');
    });

    expect(() => todoList.add(item)).toThrow('Erreur lors de l\'enregistrement de l\'item');
  });
});
