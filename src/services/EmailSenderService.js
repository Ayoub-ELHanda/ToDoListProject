class EmailSenderService {
    static sendEmail(email, message) {
      console.log(`Sending email to ${email}: ${message}`);
    }
  }
  
  module.exports = EmailSenderService;
  