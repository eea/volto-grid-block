# volto-grid-block

[![Releases](https://img.shields.io/github/v/release/eea/volto-grid-block)](https://github.com/eea/volto-grid-block/releases)

This addon enables grid layout grouping of Volto blocks. It introduces a "grid block" which can be used, from the Edit form, to group other blocks. It uses a flex based layout with column css classes. Ex. 'xs-12 sm-6 md-4 lg-3'

## Getting started

1. Create new volto project if you don't already have one:
    ```
    $ npm install -g @plone/create-volto-app
    $ create-volto-app my-volto-project
    $ cd my-volto-project
    ```

1. Update `package.json`:
    ``` JSON
    "addons": [
        "eea/volto-grid-block"
    ],

    "dependencies": {
        "@plone/volto": "github:eea/volto#7.11.1-beta.1",
        "eea/volto-grid-block": "github:eea/volto-grid-block#0.1.0"
    }
    ```

1. Install new add-ons and restart Volto:
    ```
    $ yarn
    $ yarn start
    ```

1. Go to http://localhost:3000

1. Happy editing!

## How to contribute

See [DEVELOP.md](DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
