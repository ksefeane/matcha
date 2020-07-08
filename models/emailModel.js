const conf = require('../config/emailconfig')
const pvt = require('../../emailconfig')
const nodemailer = require('nodemailer')

const email = nodemailer.createTransport(conf)

module.exports = email
