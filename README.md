# crime-viewer

View, filter and summarize incident data from the police department.

This tool has been built with Detroit's neighborhood radio patrols in mind, and beta versions have been tested by patrol members who regularly monitor and report on crime statistics in their neighborhoods.

Share bugs, ideas, and feedback with our project team through [Github Issues](https://github.com/CityOfDetroit/crime-viewer/issues) or this [web form](https://app.smartsheet.com/b/form/4b5e8883ad654704b7d04d1f9c747896).

## Development

We build this with Mapbox GL, Highcharts, jQuery, and Lodash. Behind the scenes, we use Babel to compile, Browserify and Watchify to bundle, and Uglify to minify our code. Unit testing is handled with Mocha.js, Should.js and Node's assert.

### Prereqs

You should have [Node](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) installed.

This project assumes three global dependencies: Browserify, Watchify and Uglify

If you don't have them yet, install them:
```
npm install -g browserify watchify uglify-js
```

To run tests, you should also install Mocha.js globally:
```
npm install -g mocha
```

### Install

Clone this project:
```
git clone https://github.com/CityOfDetroit/crime-viewer.git
cd crime-viewer
npm install
```

### Build

Run `npm run watch` and open `public/index.html` in your browser.

This is listening for changes in `src/main.js` and will automatically rebuild, so you just need to refresh your browser to see changes.

Or, more conveniently, try:

- Python 3.x: `npm run watch & python -m http.server 9966`
- Python 2.x: `npm run watch & python -m SimpleHTTPServer 9966`

This will watch & serve the page at `http://localhost:9966/`.

### Deploy

Run `npm run deploy`. This pipes `src/main.js` through Uglify to minify it, writes to `public/bundle.js`, and then publishes the `public/` directory to `gh-pages`.

### Tests

Run `npm test`. This runs `mocha test` plus a Babel compiler and looks for test files in the `test/` dir.

Check out [Mocha.js](https://mochajs.org) docs for how to write tests. Mocha is set up here to work with Node.js' built-in [assert](https://nodejs.org/api/assert.html) module and we've also installed [should.js](https://github.com/shouldjs/should.js).
