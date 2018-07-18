'use strict'

const cheerio = require('cheerio')

module.exports = (email) => {
  const $ = cheerio.load(email.html)
  return $('a[href*="confirm_email"]').attr('href')
}
