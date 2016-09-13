# Contributing

Please note that this project is released with a [Contributor Code of Conduct](http://contributor-covenant.org/version/1/4/). By participating in this project you agree to abide by its terms.

Interested in contributing to the other.js library itself? Read on.

Or see how to [embed other.js](EMBEDDING.md) or [create a feature](https://apps.other.chat/docs/index.html).

## Initial setup

These instructions assume you're running macOS and using the [Homebrew](http://brew.sh/) package manager. They should be trivially adaptable to Linux or other package managers.

1. Install the [Node Package Manager](https://www.npmjs.com/) via `brew install node`.
1. Clone this repo and install its dependencies by running `npm install` in its root directory.
1. Install the [EditorConfig plugin](http://editorconfig.org/#download) for your editor of choice.
1. **RECOMMENDED**: Install [Atom](https://atom.io/) or [Sublime Text](https://www.sublimetext.com/) for the most seamless editor integration with our stack.
  * Atom users will probably also want to install the  [linter](https://atom.io/packages/linter), [linter-eslint](https://atom.io/packages/linter-eslint) and [linter-stylelint](https://atom.io/packages/linter-stylelint) packages.
  * Sublime Text users will probably also want to install the [SublimeLinter](http://sublimelinter.readthedocs.io/en/latest/installation.html), [SublimeLinter-eslint](https://github.com/roadhump/SublimeLinter-eslint#installation), [SublimeLinter-contrib-stylelint](https://github.com/kungfusheep/SublimeLinter-contrib-stylelint#installation) and [babel-sublime](https://github.com/babel/babel-sublime#installation) plugins.

## Local development

1. Start the development server.

   ```sh
   npm start
   ```

1. Start an Other Chat client using `http://localhost:8888` as its otherjs host. [Web client instructions](https://github.com/other-xyz/other-chat-web/blob/master/README.md#otherjs)

## Testing

Run all tests once via:
```sh
npm test
```

Automatically re-run tests upon each save via:
```sh
npm run test:watch
```

## Deployment

Upon each commit, assuming the tests pass, [Jenkins](http://build.oregon.theother.io:8080/job/other.js/) automatically deploys to [https://apps.other.chat](https://apps.other.chat/) via:
```sh
npm run dist
npm run deploy
```
