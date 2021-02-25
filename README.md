# volto-grid-block
[![Releases](https://img.shields.io/github/v/release/eea/volto-grid-block)](https://github.com/eea/volto-grid-block/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-grid-block%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-grid-block/job/master/display/redirect)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-grid-block%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-grid-block/job/develop/display/redirect)

This addon enables grid layout grouping of Volto blocks. It introduces a "grid block" which can be used, from the Edit form, to group other blocks. It uses a flex based layout with column css classes. Ex. 'xs-12 sm-6 md-4 lg-3'

[![Volto Grid Block Demo Video](https://img.youtube.com/vi/yO16BJBEBcw/0.jpg)](https://www.youtube.com/watch?v=yO16BJBEBcw)

## Getting started

1. Create new volto project if you don't already have one:

   ```
   $ npm install -g yo @plone/generator-volto
   $ yo @plone/volto my-volto-project --addon @eeacms/volto-grid-block

   $ cd my-volto-project
   $ yarn add -W @eeacms/volto-grid-block
   ```

1. If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-grid-block"
   ],

   "dependencies": {
       "@eeacms/volto-grid-block": "^2.0.0"
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

See [DEVELOP.md](https://github.com/eea/volto-grid-block/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-grid-block/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)