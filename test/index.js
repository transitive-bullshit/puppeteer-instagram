'use strict'

const { test } = require('ava')

const PuppeteerInstagram = require('..')

test('basic', (t) => {
  const instagram = new PuppeteerInstagram()
  t.is(instagram.isAuthenticated, false)
  t.is(instagram.user, null)
})
