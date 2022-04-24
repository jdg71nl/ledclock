var express = require('express');
var indexRouter = express.Router();
const _ = require('lodash');

// const config_hash = require('../lib/config').config_hash;
// const meta_obj = require('../lib/meta').meta_obj;
// meta_obj.add_field(
//   {response: "This is a JSON-only API-server."} 
// );
// in route-func do: meta_obj.read_query(req);

// guide on http-methods: https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods

indexRouter.get('/', function(req, res, next) {
  // meta_obj.read_query(req);
  let response_hash = {response: "This is a JSON-only API-server. Also check out /api/sys-ping"};
  // res.send( Object.assign(response_hash, _.pick(meta_obj, ['meta'])) );
  res.meta_send(200, response_hash);
});

module.exports = {
  router: indexRouter,
}; 

//-EOF
