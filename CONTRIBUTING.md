# Contributing

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

## Testing

Run all tests via:
```sh
npm test
```

## Deployment

Upon each commit, assuming the tests pass, [Jenkins](http://build.oregon.theother.io:8080/job/other.js/) automatically deploys to [https://apps.other.chat](https://apps.other.chat/) via:
```sh
npm run deploy
```
