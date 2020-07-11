'use strict'

const faker = require('faker')
const ow = require('ow')
const puppeteer = require('puppeteer-extra')

const signup = require('./lib/signup')
const signin = require('./lib/signin')
const signout = require('./lib/signout')
const verifyEmail = require('./lib/verify-email')
const getMediaFeed = require('./lib/get-media-feed')

puppeteer.use(require('puppeteer-extra-plugin-stealth')())

/**
 * [Instagram](https://instagram.com) automation driven by headless chrome.
 *
 * @param {Object} [opts={ }] - Options
 * @param {Object} [opts.browser] - Puppeteer browser instance to use
 * @param {Object} [opts.puppeteer] - Puppeteer [launch options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)
 */
class PuppeteerInstagram {
  constructor (opts = { }) {
    this._opts = opts
    this._user = null
  }

  /**
   * Whether or not this instance is authenticated with Instagram.
   *
   * @member {boolean}
   */
  get isAuthenticated () { return !!this._user }

  /**
   * Authenticated user if authenticated with Instagram.
   *
   * @member {Object}
   */
  get user () { return this._user }

  /**
   * Puppeteer Browser instance to use.
   *
   * @return {Promise<Object>}
   */
  async browser () {
    if (!this._browser) {
      this._browser = this._opts.browser || await puppeteer.launch(this._opts.puppeteer)
    }

    return this._browser
  }

  /**
   * Automates the creation of a new Instagram account.
   *
   * @param {object} user - User details for new account
   * @param {string} user.email - Email
   * @param {string} [user.username] - Username
   * @param {string} [user.firstName] - First name
   * @param {string} [user.lastName] - Last name
   * @param {string} [user.password] - Password
   * @param {object} [opts={ }] - Options
   * @param {boolean} [opts.verify] - Whether or not to verify email
   * @param {string} [opts.emailPassword] - Email password for verification
   * @return {Promise}
   */
  async signup (user, opts = { }) {
    if (this.isAuthenticated) throw new Error('"signup" requires no authentication')
    ow(user, ow.object.plain.nonEmpty.label('user'))
    ow(user.email, ow.string.nonEmpty.label('user.email'))

    user.username = user.username || user.email.split('@')[0]
    user.password = user.password || faker.internet.password()
    user.firstName = user.firstName || faker.name.firstName()
    user.lastName = user.lastName || faker.name.lastName()

    user.username = user.username
      .trim()
      .toLowerCase()
      .replace(/[^\d\w-]/g, '-')
      .replace(/_/g, '-')
      .replace(/^-/g, '')
      .replace(/-$/g, '')
      .replace(/--/g, '-')

    ow(user.username, ow.string.nonEmpty.label('user.username'))
    ow(user.password, ow.string.nonEmpty.label('user.password'))
    ow(user.firstName, ow.string.nonEmpty.label('user.firstName'))
    ow(user.lastName, ow.string.nonEmpty.label('user.lastName'))

    const browser = await this.browser()
    await signup(browser, user, opts)

    this._user = user

    if (opts.verify) {
      await this.verifyEmail(opts)
    }
  }

  /**
   * Signs into an existing Instagram account.
   *
   * Note: either username or email is required.
   *
   * @param {Object} user - User details for new account
   * @param {string} [user.username] - Username
   * @param {string} [user.email] - Email
   * @param {string} user.password - Password
   * @param {Object} [opts={ }] - Options
   * @return {Promise}
   */
  async signin (user, opts = { }) {
    if (this.isAuthenticated) throw new Error('"signin" requires no authentication')

    ow(user, ow.object.plain.nonEmpty.label('user'))
    ow(user.password, ow.string.nonEmpty.label('user.password'))

    if (user.email) {
      ow(user.email, ow.string.nonEmpty.label('user.email'))
    } else {
      ow(user.username, ow.string.nonEmpty.label('user.username'))
    }

    const browser = await this.browser()
    await signin(browser, user, opts)

    this._user = user
  }

  /**
   * Signs out of the currently authenticated Instagram account
   * @return {Promise}
   */
  async signout () {
    if (!this.isAuthenticated) throw new Error('"signout" requires authentication')
    const browser = await this.browser()

    await signout(browser, this._user)
    this._user = null
  }

  /**
   * Verifies the authenticated Instagram account's email via `puppeteer-email`.
   *
   * @param {Object} opts - Options
   * @param {string} opts.emailPassword - Email password for verification
   * @param {string} [opts.email] - Email verification (defaults to user's GitHub email)
   * @return {Promise}
   */
  async verifyEmail (opts) {
    ow(opts, ow.object.plain.nonEmpty.label('opts'))
    ow(opts.emailPassword, ow.string.nonEmpty.label('opts.emailPassword'))

    const browser = await this.browser()
    await verifyEmail(browser, {
      email: opts.email || this.user.email,
      password: opts.emailPassword
    }, opts)
  }

  async getMediaFeed () {
    if (!this.isAuthenticated) throw new Error('"signout" requires authentication')
    const browser = await this.browser()

    return getMediaFeed(browser)
  }

  /**
   * Closes the underlying browser instance, effectively ending this session.
   *
   * @return {Promise}
   */
  async close () {
    const browser = await this.browser()
    await browser.close()

    this._browser = null
    this._user = null
  }
}

module.exports = PuppeteerInstagram
