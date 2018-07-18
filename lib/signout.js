'use strict'

const delay = require('delay')

module.exports = async (browser, user, opts) => {
  const page = await browser.newPage()
  await page.goto(`https://www.instagram.com/${user.username}/`)

  await delay(300)
  await page.waitForXPath('//button[contains(.,"Options")]', { visible: true })
  const [ options ] = await page.$x('//button[contains(.,"Options")]')
  await options.click({ delay: 30 })

  await delay(300)
  await page.waitForXPath('//button[contains(.,"Log Out")]', { visible: true })
  const [ logout ] = await page.$x('//button[contains(.,"Log Out")]')
  await Promise.all([
    page.waitForNavigation(),
    logout.click({ delay: 30 })
  ])

  // => https://www.instagram.com/

  await page.close()
}
