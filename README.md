# koa-adorable-avatars

## What is it?
This repository contains the [Koa middleware](https://koajs.com/#application) that can be used to host your own avatars service!

## How do I use it?
First, you'll need the `@fuelrats/koa-adorable-avatars` package:

```bash
npm install @fuelrats/koa-adorable-avatars --save
```
or
```bash
yarn add @fuelrats/koa-adorable-avatars
```

Then, use the routers within your application:

```js
// your_server.js
import Koa from 'koa';
import Router from '@koa/router';
import AvatarsRouter from 'adorable-avatars';

const router = new Router()
router.use('/avatars', router.routes(), router.allowedMethods());

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
```

That's it! Your server now includes the avatars endpoints!

### Endpoints
Assuming your server lives at `myserver.com`, and you've configured the middleware as above, you now have the following endpoints:

* `myserver.com/avatars/:id`
    * returns an avatar for the provided `id`.
    * `id` can be anything (email, username, md5 hash, as long as it's a valid URI)
    * defaults to 400px
* `myserver.com/avatars/:size/:id`
    * returns an avatar for the provided `id` at the specified `size`
    * size cannot exceed 400px
* `myserver.com/avatars/face/:eyes/:nose/:mouth/:color/:size?`
    * Allows you to generate a custom avatar from the specified parts and color, and size
    * e.g. `myserver.com/avatars/face/eyes1/nose2/mouth4/DEADBF/300`
* `myserver.com/avatars/list`
    * returns JSON of all valid parts for the custom endpoint above
  * `myserver.com/avatars/:size?/random`
      * returns a random avatar, different each time
      * e.g. `myserver.com/avatars/300/random`


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
