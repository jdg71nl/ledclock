const express = require('express');
const statusRouter = express.Router();

// const _ = require('lodash');
// const meta_obj = require('../lib/meta').meta_obj;

let pub_version = 0;
let inc_pub_version = function() {
  pub_version = pub_version + 1;
};

// https://stackoverflow.com/questions/9153571/is-there-a-way-to-get-version-from-package-json-in-nodejs-code
// https://docs.npmjs.com/cli/v6/using-npm/scripts#packagejson-vars
// process.env.npm_package_version 
// let pjson = require('../package.json');
// > npm install root-require
const pjson = require('root-require')('package.json');

const server_name = pjson.name || '??';
console.log(`# server_name = ${server_name} `);

// let app_version = 'v' + pjson.version || '?.?.?';
let app_version = pjson.version || '?.?.?';
// app_version = app_version.replace(/v/g, "");
console.log(`# app_version = ${app_version} `);

let node_version = process.version;
node_version = node_version.replace(/v/g, "");
console.log(`# node_version = ${node_version} `);

// let mongoose_version = pjson.dependencies.mongoose || 'na';
// mongoose_version = mongoose_version.replace(/\^|\~/g, "");
// console.log(`# mongoose_version = ${mongoose_version} `);

statusRouter.get('/', (req, res) => {
  let response_hash = {};
  //
  response_hash = {
    pub_version: pub_version,
    app_version: app_version,
    node_version: node_version,
    // mongoose_version: mongoose_version,
  };
  //
  // res.send( Object.assign(response_hash, _.pick(meta_obj, ['meta'])) );
  res.meta_send(200, response_hash);
});

// statusRouter.get('/:id', (req, res) => {
//   // res.send(get_report);
// });

// statusRouter.post('/', async (req, res) => {
//   // res.send(get_report);
// }); 

// statusRouter.put('/:id', async (req, res) => {
//   // res.send(get_report);
// });

// statusRouter.delete('/:id', async (req, res) => {
// });

module.exports = {
  router: statusRouter,
  pub_version: pub_version,
  inc_pub_version: inc_pub_version,
}; 

//-EOF