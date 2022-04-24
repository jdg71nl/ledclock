// config.js

// const { socket_io } = require('../app');
// const { socket_io, f_socket_io_emit_api_do_refresh } = require('../app');
// const { socket_io } = require('./socket_io');
// const { socket_io, f_socket_io_emit_api_do_refresh } = require('./socket_io');
// const { get_socket_io } = require('../app');
let socket_io = undefined;

// -- usage: in app.js:
// const parse_query_set_meta_middleware = require('./lib/meta').parse_query_set_meta_middleware;
// app.use('*', parse_query_set_meta_middleware);  
// -- usage: in route-handlers (instead of usual res.send().):
// res.meta_send(200, response_hash);
// res.meta_send(404, response_hash);

const config = require('config');
// config.get("CONFIG_APP_VERSION")     // "CONFIG_APP_VERSION":       "2.1.30",
// config.get("CONFIG_APP_SERVERNAME")  // "CONFIG_APP_SERVERNAME":    "tokenme-apiserver",
// config.get("CONFIG_APP_PORT")        // "CONFIG_APP_PORT":          8180,
// config.get("CONFIG_MONGODB_URL")     // "CONFIG_MONGODB_URL":       "mongodb://localhost",
// config.get("CONFIG_MONGODB_DBNAME")  // "CONFIG_MONGODB_DBNAME":    "tokenme",

// from TCNC course: 2 ways to read 'NODE_ENV' environment variable:
// process.env.NODE_ENV   // 'undefined'   if not defined
// app.get('env')         // 'development' if not defined
//
// var app = require('../app').app;
const env_env = process.env.NODE_ENV || "development";

const url = require('url');

// const pjson = require('root-require')('package.json');
// // const api_version = 'v' + pjson.version || '?.?.?';
// let api_version = pjson.version || '?.?.?';
// api_version = api_version.replace(/v/g, "");
// const server_name = pjson.name || '??';

let config_hash = { 
  // server_name: "wtc-nd-test",
  // server_name: server_name,
  server_name: config.get("CONFIG_APP_SERVERNAME"),
  // environment: "test",
  environment: env_env,
  db_connected: false,
};

let query_counter = {
  'endpoint_name' : 0,
}; 

let meta_obj = {
  "meta" : {},
}; 

// meta_obj.update_config = function() {
//   if (typeof(this.meta) != "object") { this.meta = {} ; }
//   this.meta.server_name = config_hash.server_name;
//   this.meta.api_version = api_version;
// };
// // also run now:
// meta_obj.update_config();

const f_set_meta_dbconn = function(status) {
  config_hash.db_connected = status;
}

let need_do_refresh = false;
let my_timer = {};
const do_refresh_interval = 1000;
const f_set_do_refresh = (new_state) => {
  if (new_state && !need_do_refresh) {
    need_do_refresh = true;
    my_timer = setTimeout(() => {
      need_do_refresh = false;
      console.log("# f_set_do_refresh: 1-sec-procedure.");
      //
      // f_socket_io_emit_api_do_refresh();
      //
      // if (!socket_io) {
      //   socket_io = get_socket_io();
      // }
      if (socket_io) {
        console.log("# socket_io.emit 'api_do_refresh' !");
        socket_io.emit('api_do_refresh');
      }  
      //
    }, do_refresh_interval);
  } else if (!new_state && need_do_refresh) {
    clearTimeout(my_timer);
  }
};

const parse_query_set_meta = function(req) {
  //
  const this_meta = {} ; // start with fresh values
  //
  //
  // guide => http://expressjs.com/en/4x/api.html#req
  // this_meta.this_req = JSON.stringify(req);
  // this_meta.req_url = req.url;
  // this_meta.originalUrl = req.originalUrl;
  // this_meta.baseUrl = req.baseUrl;
  // this_meta.path = req.path;
  //
	// GET /api/reports?asd=123    ==>gives:
  // originalUrl	"/api/reports?asd=123"
  // baseUrl	    "/api/reports"
  // path 	      "/"
  //
  // HERE: add static info:
  this_meta.server_name = config_hash.server_name;
  this_meta.environment = config_hash.environment;
  // this_meta.api_version = api_version;
  this_meta.api_version = config.get("CONFIG_APP_VERSION");
  //
  this_meta.db_connected = config_hash.db_connected;
  //
  // HERE: add query_method_path in meta
  // const parsed_url = url.parse(req.url, true);
  const parsed_url = url.parse(req.originalUrl, true);
  // this_meta.path_name = parsed_url.pathname;
  const path = parsed_url.path; // parsed_url.path =is_same_as?= req.url
  const method = req.method.toUpperCase();
  this_meta.query_method_path = `${method} ${path}`;
  //
  // HERE: add endpoint to meta
  // https://stackoverflow.com/questions/68878912/extract-substring-from-a-string-using-regex-in-javascript
  const regex = /^([^\?]*)/;
  let matches = regex.exec(path); // with matches[0] the whole matched string, and matches[n] the matched n group
  const endpoint = matches[1] || '(no-endpoint-found)';  
  this_meta.endpoint = endpoint;
  //
  // HERE: add server_time in meta
  // let date = new Date(repTime * 1000);
  // let niceTime = date.toISOString();
  // https://www.w3docs.com/snippets/javascript/how-to-format-a-javascript-date.html
  // let niceTime = date.format('YYYY-MM-DD HH:m:s') + " UTC";
  // https://momentjs.com/
  // https://momentjs.com/downloads/moment.min.js
  // https://momentjs.com/downloads/moment-with-locales.min.js
  // let niceTime = moment(date).format('YYYY-MMM-DD HH:mm:ss');
  //
  const now = new Date();
  // this_meta.server_time = now.toISOString();
  // this_meta.server_epoch = Math.round( now / 1000);
  this_meta.server_time = Math.round( now / 1000);
  //
  // HERE: endpoint query counter, return in meta response
  if (!query_counter.hasOwnProperty(endpoint)) query_counter[endpoint] = 0;
  query_counter[endpoint] = query_counter[endpoint] + 1 ;
  // this_meta.endpoint_query_count = query_counter[endpoint];
  this_meta.query_count = query_counter[endpoint];
  //
  // HERE: combine query params from body (POST) and query (GET):
  // req.query.hasOwnProperty('query_id')
  // const query_id = req.query.query_id || query_id.meta.query_id || '';
  let combi_params = {};
  if (typeof(req.query) == "object") combi_params = Object.assign(combi_params, req.query);
  if (typeof(req.body)  == "object") combi_params = Object.assign(combi_params, req.body);
  // this_meta.combi_params = combi_params;
  //
  // TBD: if query has meta.query_id, then reflect in response.meta
  // GET  ?query_id=1212
  // POST {'meta':{'query_id':'1212'}}
  if (combi_params.hasOwnProperty('query_id')) this_meta.query_id = combi_params.query_id;
  //
  return {
    this_meta:    this_meta,
    combi_params: combi_params,
  };
  //
} // \const parse_query_set_meta = function(req) {}

const parse_query_set_meta_middleware = function(req, res, next) {
  // 
  const {this_meta, combi_params} = parse_query_set_meta(req);
  // meta_obj.meta         = this_meta;
  // meta_obj.combi_params = combi_params;
  //
  // add PROPERTIES to req object:
  req.this_meta     = this_meta;
  req.combi_params  = combi_params;
  //
  // add METHOD to res object:
  res.meta_send = function(status, obj) {
    //
    this_meta.status_code = status;
    //
    if (status == 200) {
      res.send(                Object.assign(obj, {meta: this_meta} ) ); 
    } else {
      res.status(status).send( Object.assign(obj, {meta: this_meta} ) ); 
    }
  };
  //
  next();
};

meta_obj.add_field = function(hash) {
  if (typeof(hash) == "object") {
    Object.entries(hash).forEach(([key, value]) => {
      this.meta[key] = value;
    });
  }
};

// module.exports = indexRouter;
module.exports = {
  config_hash:                      config_hash,
  meta_obj:                         meta_obj,
  parse_query_set_meta_middleware:  parse_query_set_meta_middleware,
  // parse_query_set_meta:          parse_query_set_meta,
  f_set_meta_dbconn:                f_set_meta_dbconn,
  f_set_do_refresh:                 f_set_do_refresh,
}; 

// // in other modules do:
// const _ = require('lodash');
// const meta_obj = require('../lib/config').meta_obj;
// reportRouter.get('/', async (req, res) => {
//   try {
//     let response_hash = reports_test_set;
//     res.send( Object.assign(response_hash, _.pick(meta_obj, ['meta'])) );
//   } catch(err) {
//     console.log("error " + err);
//   }
// });

//-EOF