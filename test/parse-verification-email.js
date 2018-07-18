'use strict'

const { test } = require('ava')
const fs = require('fs')
const path = require('path')
const parseEmail = require('parse-email')
const parseVerificationEmail = require('../lib/parse-verification-email')

const fixturePath = path.join(__dirname, 'fixtures', 'confirmation-email.txt')

test(fixturePath, async (t) => {
  const fixture = fs.readFileSync(fixturePath, 'utf8')
  const email = await parseEmail(fixture)
  const url = parseVerificationEmail(email)

  t.is(url, 'https://instagram.com/accounts/confirm_email/YR572UiL/YmxhaXNlLmhhbnNlbkBvdXRsb29rLmNvbQ/?app_redirect=False&ndid=HMTUzMTg2ODA1MDAzNDI3ODpibGFpc2UuaGFuc2VuQG91dGxvb2suY29tOjg1OQ')
})
