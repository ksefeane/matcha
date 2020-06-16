const conf = require('../config/emailconfig')
// const pvt = require('../../emailconfig')
const nodemailer = require('nodemailer')

const email = nodemailer.createTransport(conf)

/*
var mailOptions = {
  from: 'kori@matcha.com',
  to: 'kori@mailinator.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

email.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
*/
module.exports = email
