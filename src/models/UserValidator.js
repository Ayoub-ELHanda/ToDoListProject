// UserValidator.js
class UserValidator {
  static isValid(user) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/;
    const age = new Date().getFullYear() - new Date(user.birthdate).getFullYear();

    return (
      emailRegex.test(user.email) &&
      user.firstname &&
      user.lastname &&
      passwordRegex.test(user.password) &&
      age >= 13
    );
  }
}

module.exports = UserValidator;
