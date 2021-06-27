# @fuelrats/next-adorable-avatars

This repository contains the [Next.js][] API Routes that can be used to host your own avatars service!

## ⚠️ In Development Warning ⚠️

This package is still in early development, and it's API is not yet stable. Until a `v1.0` release, consider all minor semver releases (v0.x) to be **BREAKING**.

## Prerequisites

- [Next.js][] version `>=v9.5.0`


## Installation

1. First, you'll need the `@fuelrats/next-adorable-avatars` package:

```bash
npm install @fuelrats/next-adorable-avatars --save
```
or
```bash
yarn add @fuelrats/next-adorable-avatars
```

2. Create the directory `/api/avatars` under your `/pages` directory.
3. Inside this directory, create a [catch all API route][next-catch-all-api] named `[...slug].js`.
    * While the router may be mounted under _any_ api sub-directory, the file **MUST** be named `[...slug].js` for the router to properly map route parameters.
4. Export `avatarsRouter` from this new API Route:

```js
// /pages/api/avatars/[...slug].js
import avatarsRouter from '@fuelrats/next-adorable-avatars';

export default avatarsRouter()
```

5. That's it! Your server will now serve the avatar endpoints!

### Endpoints
Assuming your server lives at `myserver.com`, and you've configured the middleware as above, you now have the following endpoints:

* `myserver.com/api/avatars/:seed`
    * returns an avatar for the provided `seed`.
    * `seed` can be anything (email, username, md5 hash, as long as it's a valid URI)
    * size defaults to `512x512px`
* `myserver.com/api/avatars/:seed/:size`
    * returns an avatar for the provided `seed` at the specified `size`
    * `size` must be `>=32 && <=512`
* `myserver.com/api/avatars/:seed/:size/:format`
    * returns an avatar for the provided `seed` at the specified `size` and `format`
    * See below for supported formats
* `myserver.com/api/avatars/random/:size?/:format?`
    * returns a random avatar, different each time
    * Optionally accepts size and format options like the endpoints above.
    * e.g. `myserver.com/avatars/random/300`
* `myserver.com/api/avatars/face/:eyes/:nose/:mouth/:color/:size?/:format?`
    * Allows you to generate a custom avatar from the specified parts and color.
    * Optionally accepts size and format options like the endpoints above.
    * Parts accept the value `x` for a blank part.
    * Parts and color accept the value `*` for a random value.
    * e.g. `myserver.com/api/avatars/face/eyes1/nose2/mouth4/DEADBF/300/jpeg`
* `myserver.com/api/avatars/list`
    * returns JSON of all valid parts for the custom endpoint above
    * Also contains list of valid output formats.


### Using `next/image`

Using `next/image` is encouraged by both Vercel and this library, However some considerations should be made.

1. Using a loader to resolve the avatar URL is recommended. This is mainly to provide convienence.
1. Consider setting `unoptimized` to `true` if your website has a high traffic load, as it may cause a bloated cache over time.
  * A custom server cache strategy is in planning for both short and long term image caching.

```jsx
import Image from 'next/image'

const avatarLoader = ({ src, width }) => {
    return `/api/avatars/${src}/${width}`
}

function SomeComponent (props) => {
    return (
        <Image
            unoptimized
            loader={avatarLoader}
            src={props.id}
            alt="Profile picture of the user"
            width={200}
            height={200}
        />
    )
}
```


### Supported Output Formats

| Format   | Parameter      |             |
|----------|:--------------:|:-----------:|
| **webp** | **`webp`**     | **Default** |
| avif     | `avif`         |             |
| gif      | `gif`          |             |
| heif     | `heic`, `heif` |             |
| jpeg     | `jpg`, `jpeg`  |             |
| png      | `png`          |             |
| tiff     | `tiff`         |             |

**NOTE:** While `TIFF`, `AVIF`, and `HEIF` are all supported by the renderer, browser support for these formats is limited or non-existant.

## Development
If you're developing locally, you'll first need to bootstrap (assumes [nvm](https://github.com/creationix/nvm)):

```bash
# use correct node version
nvm use

# install dependencies
yarn
```

Then, there are several scripts that will be useful:

```bash
# run the unit tests
yarn test

# run both a dev server and eslint
yarn dev

# run a dev server
yarn dev:server

# run eslint
yarn dev:lint

# compile the application
yarn build
```

## Contributing

Please read the [contributors' guide](CONTRIBUTING.md)

## Open-source Contributors

* [missingdink](https://twitter.com/missingdink): Illustrated the very first avatars! [Check them out!](http://api.adorable.io/avatar/hi_mom)





[Next.js]: https://nextjs.org
[next-catch-all-api]: https://nextjs.org/docs/api-routes/dynamic-api-routes#catch-all-api-routes
