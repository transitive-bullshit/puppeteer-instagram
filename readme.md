# puppeteer-instagram

> [Instagram](https://instagram.com) automation driven by headless chrome.

[![NPM](https://img.shields.io/npm/v/puppeteer-instagram.svg)](https://www.npmjs.com/package/puppeteer-instagram) [![Build Status](https://travis-ci.com/transitive-bullshit/puppeteer-instagram.svg?branch=master)](https://travis-ci.com/transitive-bullshit/puppeteer-instagram) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This module also has a [CLI](https://github.com/transitive-bullshit/puppeteer-instagram-cli).

## Install

```bash
npm install --save puppeteer-instagram
```

## Usage

This example signs into a [Instagram](https://instagram.com) account.

```js
const PuppeteerInstagram = require('puppeteer-instagram')

const instagram = new PuppeteerInstagram()

await instagram.signin({ username: 'xxx', password: 'xxx' })
await instagram.close()
```

## API

TODO

## Related

-   [puppeteer-instagram-cli](https://github.com/transitive-bullshit/puppeteer-instagram-cli) - CLI for this module.
-   [puppeteer-email](https://github.com/transitive-bullshit/puppeteer-email) - Email automation driven by headless chrome.
-   [puppeteer](https://github.com/GoogleChrome/puppeteer) - Headless Chrome Node API.
-   [awesome-puppeteer](https://github.com/transitive-bullshit/awesome-puppeteer) - Curated list of awesome puppeteer resources.

## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
