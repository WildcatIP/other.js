# Contributing

Interested in contributing to the other.js library itself? Read on.

Or see how to [embed other.js](EMBEDDING.md) or [create a feature](https://apps.other.chat/docs/module-other.html).

## Initial setup

These instructions assume you're running macOS and using the [Homebrew](http://brew.sh/) package manager. They should be trivially adaptable to Linux or other package managers.

1. Install the [Node Package Manager](https://www.npmjs.com/) via `brew install node`.
1. Clone this repo and install its dependencies by running `npm install` in its root directory.
1. **RECOMMENDED**: Install [Atom](https://atom.io/) or [Sublime Text](https://www.sublimetext.com/) for seamless editor integration with our stack. Atom users will probably also want to install the [editorconfig](https://atom.io/packages/editorconfig), [linter](https://atom.io/packages/linter) and [linter-eslint](https://atom.io/packages/linter-eslint) packages.

## Testing

Run all tests via:
```sh
npm test
```

## Deployment

Assuming the tests pass, [Jenkins](http://build.oregon.theother.io:8080/job/other.js/) automatically deploys the `examples` directory to [https://apps.other.chat](https://apps.other.chat/) upon each commit.
