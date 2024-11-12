class UserValidator {
    static isValid(user) {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,40}$/;
  
      const isEmailValid = emailPattern.test(user.email);
      const isNameValid = user.firstname && user.lastname;
      const isPasswordValid = passwordPattern.test(user.password);
      const isOldEnough = new Date().getFullYear() - new Date(user.birthdate).getFullYear() >= 13;
  
      return isEmailValid && isNameValid && isPasswordValid && isOldEnough;
    }
  }
  
  module.exports = UserValidator;
  