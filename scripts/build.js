// Require
var requirejs = require('requirejs');
var fs = require('fs');
var path = require('path');
var pjson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json")));

// Configure RequireJS
var config = {
  baseUrl: "src/lib/", // Base URL
  mainConfigFile: "scripts/main.js", // include all dependencies from main
  paths: { // requireLib will be included and optimized
    "requireLib": "../../node_modules/requirejs/require"
  },
  optimize: "none",
  include: "requireLib",
  name: "gameController", // Name of script to start building from
  insertRequire: ["gameController"],
  out: 'build/' + pjson.name + '-' + pjson.version + '.min.js' // Where to output
};

// Optimize our script
requirejs.optimize(config, function(buildResponse) {
  var contents = fs.readFileSync(config.out, 'utf-8');
});