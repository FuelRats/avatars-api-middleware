# @fuelrats/next-adorable-avatars

## What is it?
This repository contains the [Next.js][] API Routes that can be used to host your own avatars service!

## Prerequisites

- [Next.js][] version `>=v9.5.0`


## How do I use it?
First, you'll need the `@fuelrats/next-adorable-avatars` package:

```bash
npm install @fuelrats/next-adorable-avatars --save
```
or
```bash
yarn add @fuelrats/next-adorable-avatars
```

Then, create a file named `[[...slug]].js`

**IMPORTANT:** While the router may be mounted under _any_ api route, the file **MUST** be named `[[...slug]].js` for the router to properly map route parameters.

```js
// /pages/api/avatars/[[...slug]].js
import avatarsRouter from '@fuelrats/next-adorable-avatars';

export default avatarsRouter
```

That's it! Your server now includes the avatars endpoints!

### Endpoints
Assuming your server lives at `myserver.com`, and you've configured the middleware as above, you now have the following endpoints:

* `myserver.com/api/avatars/:id`
    * returns an avatar for the provided `id`.
    * `id` can be anything (email, username, md5 hash, as long as it's a valid URI)
    * size defaults to `400x400px`
* `myserver.com/api/avatars/:id/:size`
    * returns an avatar for the provided `id` at the specified `size`
    * `size` must be `>=32 && <=512`
* `myserver.com/api/avatars/:id/:size/:format`
    * returns an avatar for the provided `id` at the specified `size` and `format`
    * See below for supported formats
* `myserver.com/api/avatars/random/:size?/:format?`
    * returns a random avatar, different each time
    * Optionally accepts size and format options like the endpoints above.
    * e.g. `myserver.com/avatars/random/300`
* `myserver.com/api/avatars/face/:eyes/:nose/:mouth/:color/:size?/:format?`
    * Allows you to generate a custom avatar from the specified parts and color, and size
    * Optionally accepts size and format options like the endpoints above.
    * e.g. `myserver.com/api/avatars/face/eyes1/nose2/mouth4/DEADBF/300/jpeg`
* `myserver.com/api/avatars/list`
    * returns JSON of all valid parts for the custom endpoint above


## Supported Output Formats

| Format   | Parameter      |              |
|----------|:--------------:|:------------:|
| **webp** | **`webp`**     | **Default**  |
| avif     | `avif`         |              |
| gif      | `gif`          |              |
| heif     | `heic`, `heif` |              |
| jpeg     | `jpg`, `jpeg`  |              |
| png      | `png`          |              |
| tiff     | `tiff`         |              |

**NOTE:** While `TIFF`, `AVIF`, and `HEIF` are all supported by the renderer, browser support for these formats is limited or non-existant.

## Development
If you're developing locally, you'll first need to bootstrap (assumes [nvm](https://github.com/creationix/nvm)):

```bash
# use correct node version
nvm use

# install dependencies
npm install
```

Then, there are several npm scripts that will be useful:

```bash
# run the unit tests
npm test

# run both a dev server and eslint
npm run dev

# run a dev server
npm run dev:server

# run eslint
npm run dev:lint

# compile the application
npm run build
```

## Contributing

Please read the [contributors' guide](CONTRIBUTING.md)

## Open-source Contributors

* [missingdink](https://twitter.com/missingdink): Illustrated the very first avatars! [Check them out!](http://api.adorable.io/avatar/hi_mom)





[Next.js]: https://nextjs.org
