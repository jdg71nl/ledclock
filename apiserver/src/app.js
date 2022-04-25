//= app.js
// guide: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference

// /Users/jdg/dev/DB-Dev/node.js-course-zip/4.1- Express/after/index.js
// const debug = require('debug')('app:startup');

// https://www.npmjs.com/package/config
// https://github.com/lorenwest/node-config/wiki/Common-Usage
// > npm install config
// > mkdir config
// > touch config/default.json
// > touch config/development.json
// > touch config/production.json
// > touch config/custom-environment-variables
// const config = require('config');    // npm install --save config
// console.log("app name: "    + config.get("name") );
// console.log("mail server: " + config.get("mail.host") );
//
const config = require('config');
// config.get("CONFIG_APP_VERSION")     // "CONFIG_APP_VERSION":       "2.1.30",
// config.get("CONFIG_APP_SERVERNAME")  // "CONFIG_APP_SERVERNAME":    "tokenme-apiserver",
// config.get("CONFIG_APP_PORT")        // "CONFIG_APP_PORT":          8180,
// config.get("CONFIG_MONGODB_URL")     // "CONFIG_MONGODB_URL":       "mongodb://localhost",
// config.get("CONFIG_MONGODB_DBNAME")  // "CONFIG_MONGODB_DBNAME":    "tokenme",

// const test_env = ["CONFIG_MONGODB_URL", "CONFIG_MONGODB_USERNAME", "CONFIG_MONGODB_PASSWORD", "CONFIG_APP_PORT"];
const config_defaults = require('root-require')('/config/default.json');
const test_env = Object.keys(config_defaults);
//
// test_env.forEach(env_var => {
test_env.filter(key => key[0] != "#" ).forEach(env_var => {
  const config_var = config.get(env_var) || "";
  console.log(`# config/env variable: ${env_var}=${config_var}`);
  // if (config_var.length == 0) {
  //   console.log(`# Error: required environment-variable '${env_var}' is not provided, exiting..`);
  //   process.exit(1);
  // }
});

// const Joi = require('joi');
// const logger = require('./middleware/logger');

// const basicAuth = require('express-basic-auth');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var express = require('express');
// var app = express();
const require_express = require('express');
const app = require_express();

// // socket.io
// // guide => https://socket.io/
// //
// // on client default used: <script src="/socket.io/socket.io.js"></script>    // see also: https://socket.io/docs/v4/client-installation/#standalone-build
// // const socketio_path = '/socket.io/';
// // const socketio_path = '/api/sys-socketio/';
// const socketio_path = '/sock/sys-socketio/';
// // const socketio_path = '/api/sys-socketio';
// console.log("# socketio_path = ", socketio_path);
// //
const http_obj = require('http');
const http_server = http_obj.createServer(app);
// const { Server } = require("socket.io");   // npm install socket.io --save
// const socketio_server_options = {   // https://socket.io/docs/v4/server-options/
//   path: socketio_path
// };
// // const socket_io = new Server(http_server);
// const socket_io = new Server(http_server, socketio_server_options);
//
// idea from: https://ourcodeworld.com/articles/read/272/how-to-use-socket-io-properly-with-express-framework-in-node-js
// app.use('/api/static', require_express.static('node_modules')); // this works: > curl http://cloud.i.sostark.nl:8052/api/static/socket.io/client-dist/socket.io.min.js
//
// d220218 jdg now it works: 
// > curl --head http://cloud.i.sostark.nl:8052/api/sys-socketio/socket.io.min.js 
// HTTP/1.1 200 OK
// Cache-Control: public, max-age=0
// Content-Type: application/javascript
// ETag: "4.4.1"
// Date: Fri, 18 Feb 2022 15:43:48 GMT
// Connection: keep-alive
// Keep-Alive: timeout=5
//
const pub_path = path.join(__dirname, 'public');
console.log("# pub_path = ", pub_path);   // # pub_path =  /mnt/vdb1/home/jdg/dev/TokenMe-API-Server/src/public
app.use(require_express.static(pub_path));
//
// app.use('/api/public/test_1e52', require_express.static( pub_path+'/test_1e52' ));    // this works: http://cloud.i.sostark.nl:8052/api/public/test_1e52/chat.html
//
// # this code in 'public/test_1e52/chat.html' works:
// <script src="/api/sys-socketio/socket.io.min.js"></script>
// <script>
//   const api_url = 'http://cloud.i.sostark.nl:8052';
//   const socketio_path = '/api/sys-socketio/';
//   var socket_io = io(api_url, {path: socketio_path});
// </script>
//
// ::ffff:10.212.21.60 - GET /api/public/test_1e52/ HTTP/1.1 404 296 - 0.600 ms
// ::ffff:10.212.21.60 - GET /socket.io/?EIO=4&transport=polling&t=NyDNbQA HTTP/1.1 404 308 - 1.306 ms
//
// socket_io.on('connection', (socket) => {
//   console.log('a user connected');
//   //
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
//   //
//   socket.on('socketio_new_chat_message', (msg) => {
//     console.log('message: ' + msg);
//     socket_io.emit('socketio_update_chat_message', msg);
//   });
//   //
// });
//
let connected = false;
let do_refresh = false;

// // socket_io.on('connection', (socket, {client_id}) => {
// socket_io.on('connection', (socket) => {
//   console.log(`# socket_io: new connection.`);
//   // console.log(`# socket_io: new connection (client_id="${client_id}").`);
//   //
//   socket.on('disconnect', () => {
//     console.log('# socket_io: disconnected');
//   });
//   //
//   // keep (OOB) for testing:
//   socket.on('socketio_new_chat_message', (msg) => {
//     console.log('message: ' + msg);
//     socket_io.emit('socketio_update_chat_message', msg);
//   });
//   //
//   socket.on('webui_connect_req', ({client_id}) => {
//     console.log(`# socket_io: webui_connect_req (client_id="${client_id}").`);
//     connected = true;
//     socket_io.emit('webui_connect_ack', {
//       connected: connected
//     });
//   });
//   //
// });

// // const f_socket_io_emit_api_do_refresh = () => {
// //   socket_io.emit('api_do_refresh');
// // };

// function get_socket_io() {
//   return socket_io;
// };

// https://lodash.com/
// Functional programming (FP) guide
// https://github.com/lodash/lodash/wiki/FP-Guide
// https://github.com/lodash/lodash
// npm i --save lodash
// var _ = require('lodash');

// const url = require('url');
//
// const _ = require('lodash');
// const meta_obj = require('./lib/config').meta_obj;
// const parse_query_set_meta = require('./lib/meta').parse_query_set_meta ;
// const {this_meta, combi_params} = parse_query_set_meta(req);
// new:
// const {parse_query_set_meta_middleware} = require('./lib/meta');
const {parse_query_set_meta_middleware, f_set_meta_dbconn } = require('./lib/meta');
// usage: in app.js:
// app.use('*', parse_query_set_meta_middleware);  
// usage: in route-handlers (instead of usual res.send().):
// res.meta_send(200, response_hash);
// res.meta_send(404, response_hash);

// let pub_path = path.join(__dirname, 'public');
// console.log("# pub_path = ", pub_path);

// // let pub_dirty = require('./routes/status').pub_dirty;
// let inc_pub_version = require('./routes/status').inc_pub_version;

// // https://www.bezkoder.com/node-js-watch-folder-changes/
// // npm install chokidar fs-extra
// const chokidar = require('chokidar'); // chokidar = "watch folder changes"
// // const watcher = chokidar.watch('path/to/folder', { persistent: true });
// const pub_watcher = chokidar.watch(pub_path, { persistent: true });
// // watcher
// //   .on('add',        path =>   console.log(`File ${path} has been added`))
// //   .on('change',     path =>   console.log(`File ${path} has been changed`))
// //   .on('unlink',     path =>   console.log(`File ${path} has been removed`))
// //   .on('addDir',     path =>   console.log(`Directory ${path} has been added`))
// //   .on('unlinkDir',  path =>   console.log(`Directory ${path} has been removed`))
// //   .on('error',      error =>  console.log(`Watcher error: ${error}`))
// //   .on('ready',      () =>     console.log('Initial scan complete. Ready for changes'))
// // ;
// pub_watcher
//   .on('change',     path =>   {
//     console.log(`############ chokidar: file "${path}" has been changed`);
//     inc_pub_version(); // call function
//   })
//   .on('error',      error =>  console.log(`Watcher error: ${error}`))
//   .on('ready',      () =>     console.log('Initial scan complete. Ready for changes'))
// ;
// //

// var indexRouter = require('./routes/index').router;
// const reportRouter    = require('./routes/reports').router;
// const timepointRouter = require('./routes/timepoints').router;
// const anchorRouter    = require('./routes/anchors').router;
// const tokenRouter     = require('./routes/tokens').router;
// const mapRouter     = require('./routes/maps').router;
// const status_router    = require('./routes/sys-status').router;
// const rpc_router = require('./routes/sys-rpc').router;


// https://socket.io/get-started/chat
// > npm install --save socket.io
// + socket.io@4.2.0
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// DONT??: const http = require('http').Server(app);
//
// https://doc.scalingo.com/languages/nodejs/websocket-web-same-port
// const http_createServer = require('http').createServer(app);
// const io = require('socket.io')(http_createServer);
//
// // problems: 
// GET http://10.220.21.100/socket.io/socket.io.js
// [HTTP/1.1 404 Not Found 226ms]
// The resource from “http://10.220.21.100/socket.io/socket.io.js” was blocked due to MIME type (“text/html”) mismatch (X-Content-Type-Options: nosniff).
// Loading failed for the <script> with source “http://10.220.21.100/socket.io/socket.io.js”. 10.220.21.100:44:1
// Uncaught ReferenceError: io is not defined
// {/* https://github.com/socketio/socket.io/issues/3608 */}
//
// no solution: https://github.com/socketio/socket.io/issues/3608
//
// search: socket.io.js blocked MIME type text/html mismatch X-Content-Type-Options nosniff
// found: https://stackoverflow.com/questions/19426882/node-js-socket-io-socket-io-js-not-found/19429146
//
// app.use(express.static(path.join(__dirname, '/')))
//
// Below example from: https://socket.io/get-started/chat
// // const express = require('express');
// // const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
// // app.get('/', (req, res) => {
// //   res.sendFile(__dirname + '/index.html');
// // });
// io.on('connection', (socket) => {
//   console.log('######## (socket.io): a user connected');
// });
// // server.listen(3000, () => {
// //   console.log('listening on *:3000');
// // });
//
// https://stackoverflow.com/questions/47627244/how-to-make-express-js-and-socket-io-listen-to-different-ports
// var ioApp = require('http').createServer(handler);
// var io = require('socket.io')(ioApp);
// ioApp.listen(3301);
// function handler (req, res) {
//   res.writeHead(200).end({});
// }
// JDG: gotver-de-gotver nu krijg ik een CORS error
//
// io.on('connection', (socket) => {
//   console.log('############################### (socket.io): a user connected');
// });

// https://www.npmjs.com/package/express-basic-auth
// this Express is exposed as: https://sostark.zerotime.nl/
// app.use(basicAuth({
//   users: { 'sostark-demo-user': 'VoorUitMetGeit23' },
//   challenge: true // <--- needed to actually show the login dialog!
// }));
// app.use(logger('dev')); // morgan
//
// jdg: temp-disabled for socket.io testing:
app.use(require_express.json());
app.use(require_express.urlencoded({ extended: false }));
app.use(cookieParser());

// /Users/jdg/dev/DB-Dev/node.js-course-zip/4.1- Express/after/index.js
// https://expressjs.com/en/advanced/best-practice-security.html
//
// jdg: temp-disabled for socket.io testing:
// const helmet = require('helmet');  app.use(helmet());   // npm install --save helmet
//
// https://medium.com/@nrshahri/csp-cra-324dd83fe5ff
// Content Security Policy (CSP) in Create-React-App (CRA)
//
// https://stackoverflow.com/questions/63643775/content-security-policy-the-page-s-settings-blocked-the-loading-of-a-resource-a
const helmet = require('helmet');   // npm install --save helmet
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": [ "'self'", "http: 'unsafe-inline'", "https: 'unsafe-inline'" ],
      "base-uri": [ "'self'", "http: 'unsafe-inline'", "https: 'unsafe-inline'" ],
      "img-src":  [ "'self'", "http: 'unsafe-inline'", "https: 'unsafe-inline'" ],
      "script-src":  [ "'self'", "http: 'unsafe-inline'", "https: 'unsafe-inline'" ],
      "style-src":  [ "'self'", "http: 'unsafe-inline'", "https: 'unsafe-inline'" ],
      upgradeInsecureRequests: [],
    },
    reportOnly: false,
  }),
);
// app.use(
//   helmet.contentSecurityPolicy({
//     useDefaults: false,
//     "block-all-mixed-content": true,
//     "upgrade-insecure-requests": true,
//     directives: {
//       "default-src": [
//           "'self'"
//       ],
//       "base-uri": "'self'",
//       "font-src": [
//           "'self'",
//           "https:",
//           "data:"
//       ],
//       "frame-ancestors": [
//           "'self'"
//       ],
//       "img-src": [
//           "'self'",
//           "data:"
//       ],
//       "object-src": [
//           "'none'"
//       ],
//       "script-src": [
//           "'self'",
//           "https://cdnjs.cloudflare.com"
//       ],
//       "script-src-attr": "'none'",
//       "style-src": [
//           "'self'",
//           "https://cdnjs.cloudflare.com"
//       ],
//     },
//   }),
//   helmet.dnsPrefetchControl({
//       allow: true
//   }),
//   helmet.frameguard({
//       action: "deny"
//   }),
//   helmet.hidePoweredBy(),
//   helmet.hsts({
//       maxAge: 123456,
//       includeSubDomains: false
//   }),
//   helmet.ieNoOpen(),
//   helmet.noSniff(),
//   helmet.referrerPolicy({
//       policy: [ "origin", "unsafe-url" ]
//   }),
//   helmet.xssFilter()
// );

// https://expressjs.com/en/starter/static-files.html
// http://expressjs.com/en/resources/middleware/serve-static.html
// https://expressjs.com/en/4x/api.html#app.use
// let pub_path = path.join(__dirname, 'public');
// console.log("# pub_path = ", pub_path);
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(pub_path));
// app.use('/s', express.static(pub_path))
// app.use('/favicon.ico', express.static(pub_path+'favicon.js'))

// jdg: temp-disabled for socket.io testing:
var morgan = require('morgan');   // https://www.npmjs.com/package/morgan
// if (app.get('env') === 'development') {
//   app.use(morgan('tiny'));
//   debug('Morgan enabled...');
// }
// app.use(morgan('tiny'));
// app.use(morgan('combined'));
// app.use(morgan('common'));
app.use(morgan('short'));

// let pub_path = path.join(__dirname, 'pub_build');
// let pub_path = path.join(__dirname, 'src', 'pub_build');
// let pub_path = path.join(__dirname, 'public');
// console.log("# pub_path = ", pub_path);
// app.use(require_express.static(pub_path));

// guide: http://expressjs.com/en/guide/using-middleware.html
// https://stackoverflow.com/questions/37118070/adding-property-to-the-request-using-node-and-express
// app.use(parse_query_set_meta_middleware);  
// jdg: temp-disabled for socket.io testing:
app.use('*', parse_query_set_meta_middleware);  
//
//// JDG Note: better make this dynamic, so if public/index.html exists, then ... else ...
//app.use('/', indexRouter);    // <=== USE ONLY 'indexRouter' if we want this API-server to be JSON-only (not serving HTML info page)
//
// app.use('/api/reports', reportRouter);
// app.use('/api/anchors', anchorRouter);
// app.use('/api/tokens', tokenRouter);
// app.use('/api/timepoints', timepointRouter);
// app.use('/api/maps', mapRouter);
// app.use('/api/sys-status', status_router);
// app.use('/api/sys-rpc', rpc_router);
// const showgen_router      = require("./routes/sys-showgen"  ).router;   app.use("/api/sys-showgen", showgen_router      );
const sys_ping_router     = require("./routes/sys-ping"     ).router;   app.use("/api/sys-ping",    sys_ping_router     );
// const sys_dbcheck_router  = require("./routes/sys-dbcheck"  ).router;   app.use("/api/sys-dbcheck", sys_dbcheck_router  );
// const mqtt_router         = require('./routes/mqtt'         ).router;   app.use("/api/mqtt",        mqtt_router         );
//
const brightness_router = require('./routes/brightness').router; app.use("/api/brightness", brightness_router);
//
app.use(require_express.static(pub_path));

// 404 Not Found -- handler:
//
// https://stackoverflow.com/questions/31984890/custom-404-page-with-express-js
//
// jdg: temp-disabled for socket.io testing:
app.use(function(req, res, next) {
  // var err = new Error('Not Found');
  // err.status = 404;
  // next(err);
  //
  // const parsed_url = url.parse(req.url, true);
  // console.log("# req.url = ", req.url);
  // console.log("# parsed_url = ", parsed_url);
  //
  // meta_obj.parse_query_set_meta_middleware(req);
  // const {this_meta, combi_params} = parse_query_set_meta(req);
  //
  let response_hash = {response: "404: resource not found."};
  //
  // res.send( Object.assign(response_hash, _.pick(meta_obj, ['meta'])), 404 );     // <== express deprecated res.send(body, status): Use res.status(status).send(body) instead
  // res.status(404).send( Object.assign(response_hash, _.pick(meta_obj, ['meta'])) );
  // res.status(404).send( Object.assign(response_hash, meta_obj.meta) );
  // res.status(404).send( Object.assign(response_hash, this_meta ) );
  // res.status(404).send( Object.assign(response_hash, {meta: this_meta} ) );
  res.meta_send(404, response_hash);
  //
});
//
// https://www.hacksparrow.com/webdev/express/custom-error-pages-404-and-500.html
// // Handle 404
// app.use(function(req, res) {
//   res.send('404: Page not Found', 404);
// });
// // Handle 500
// app.use(function(error, req, res, next) {
//   res.send('500: Internal Server Error', 500);
// });

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/public/index.html');
// });

// // https://en.wikipedia.org/wiki/HTTP_ETag
// // The ETag or entity tag is part of HTTP, the protocol for the World Wide Web. It is one of several mechanisms that HTTP provides for Web cache validation, which allows a client to make conditional requests.
// app.disable('etag');

// connect to TCP port:
// https://nodejs.org/api/net.html#net_net_createconnection_options_connectionlistener
// const net = require('net');
// //
// try {
//   const tcp_port_mongo_express_52 = 8152;
//   let net_connect_client = net.connect({port: tcp_port_mongo_express_52}, function() {
//     console.log('# net_connect_client connected to TCP port ', tcp_port_mongo_express_52);
//     net_connect_client.end();
//   });
//   //
//   const tcp_port_mongo_mydb_52 = 27052;
//   net_connect_client = net.connect({port: tcp_port_mongo_mydb_52}, function() {
//     console.log('# net_connect_client connected to TCP port ', tcp_port_mongo_mydb_52);
//     net_connect_client.end();
//   });  
// } catch(error) {
//   console.log('# net_connect_client error = ', JSON.stringify(error) );
// } 
//
// another way?: https://github.com/sugyan/node-test-tcp

// // MongoDB / Mongoose:
// //
// // CLI: > mongosh "mongodb://localhost/wtc-nd-test"
// // https://www.mongodb.com/developer/quickstart/cheat-sheet/
// // db.coll.drop()    // removes the collection and its index definitions
// // db.dropDatabase() // double check that you are *NOT* on the PROD cluster... :-)
// // https://docs.mongodb.com/manual/reference/method/db.collection.drop/
// //
// // wtc-nd-test> show collections
// // anchors
// // maps
// // locations
// // reports
// // timepoints
// // tokens
// // db.anchors.drop()
// // db.maps.drop()
// // db.locations.drop()
// // db.reports.drop()
// // db.timepoints.drop()
// // db.tokens.drop()
// //
// // const mongodb_server = 'mongodb://localhost:27057/wtc-nd-test';
// // const mongodb_server = 'mongodb://localhost:27052/tokenme-tst-v2';
// // const mongodb_server = 'mongodb://mongo-mydb-52:27052/tokenme-tst-v2';
// // console.log(`# trying to connect to MongoDB (server="${mongodb_server}") ...`)
// //
// // You can also specify several more parameters in the uri:
// // mongoose.connect('mongodb://username:password@host:port/database?options...');
// // mongoose.connect('mongodb://localhost:27017/myapp');
// // ==> This is the minimum needed to connect the myapp database running locally on the default port (27017). If connecting fails on your machine, try using 127.0.0.1 instead of localhost.
// // const mongoose_connect_uri = 'mongodb://127.0.0.1:27052/tokenme-tst-v2';
// // const mongoose_connect_uri = "mongodb://mongo-mydb-52:27052/tokenme-tst-v2";
// //
// const mongoose = require('mongoose');   // npm install mongoose --save   // npm uninstall mongoose --save  // also do: npm uninstall mogoose --save
// //
// // https://mongoosejs.com/docs/connections.html#options
// const mongoose_connect_options = {};
// //
// const XX_mongoose_connect_options = {
//     // dbName:   "",   // overrides any database specified in the connection string. This
//   // user:     "",   // equivalent to MongoDB auth.username and auth.password options
//   // pass:     "",   // 
//   //
//   // socketTimeoutMS - How long the MongoDB driver will wait before killing a socket due to inactivity after initial connection. A socket may be inactive because of either no activity or a long-running operation. This is set to 30000 by default, you should set this to 2-3x your longest running operation if you expect some of your database operations to run longer than 20 seconds. This option is passed to Node.js 
//   socketTimeoutMS: 9000,
//   //
//   // family - Whether to connect using IPv4 or IPv6. This option passed to Node.js' dns.lookup() function. If you don't specify this option, the MongoDB driver will try IPv6 first and then IPv4 if IPv6 fails. If your mongoose.connect(uri) call takes a long time, try mongoose.connect(uri, { family: 4 })
//   family: 4,
//   //
//   // serverSelectionTimeoutMS - The MongoDB driver will try to find a server to send any given operation to, and keep retrying for serverSelectionTimeoutMS milliseconds. If not set, the MongoDB driver defaults to using 30000 (30 seconds).
//   serverSelectionTimeoutMS: 3000,
//   //
//   // useNewUrlParser: true,
//   //
//   useUnifiedTopology: true,
//   //
//   // reconnectTries: Number.MAX_VALUE,
//   // reconnectInterval: 500, // Reconnect every 500ms
//   // poolSize: 10 // Maintain up to 10 socket connections
//   //
//   ssl: false,
//   sslValidate: false,
//   //
// };
// //
// // console.log(`# trying to connect to MongoDB (uri="${mongoose_connect_uri}") ...`)
// //
// // mongoose.connect(mongodb_server)
// // mongoose.connect(mongoose_connect_uri, mongoose_connect_uri)
// // mongoose.connect(mongoose_connect_uri)
// //   .then(() => {
// //     // console.log(`Connected to MongoDB (uri="${mongoose_connect_uri}").`)
// //     console.log("Connected to MongoDB.")
// //   })
// //   .catch((error) => {
// //     console.error( "ERROR: could not connect to MongoDB. error.json = ", JSON.stringify(error) );
// //     const after_mongoose_error_keep_open = true;
// //     if (after_mongoose_error_keep_open) {
// //       console.log("# we wanna 'after_mongoose_error_keep_open' so we don't do 'process.exit(1)' ...");
// //     } else {
// //       process.exit(1);
// //     }
// //   } )
// // ;

// // ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------

// // https://mongoosejs.com/docs/connections.html
// //
// // JDG: maybe a clue to my mongoose-mogodb connection problems??
// //
// // https://github.com/accounts-js/accounts/issues/1174
// // https://stackoverflow.com/questions/45576367/mongoose-connection-authentication-failed
// // I had the same problem many hours ago, and after all I solve it. My code is:
// // mongoose.createConnection(
// //   "mongodb://localhost:27017/dbName",
// //   {
// //     "auth": {
// //       "authSource": "admin"
// //     },
// //     "user": "admin",
// //     "pass": "password"
// //   }
// // );
// // Why is mongoose documentation so difficult!? I had tried many variations of these but just did not try this one. Finally you saved my day. Thanks @kartGIS – 
// // Temp O'rary
// // Oct 13 '17 at 10:02
// //
// // JDG: note that only listen IPv6 ?!?
// // > ng 27052
// // com.docke 10465  jdg  110u  IPv6 0x2e7ec064b6e55005      0t0  TCP *:27052 (LISTEN)
// //
// // https://github.com/Automattic/mongoose/issues/6052
// // BorntraegerMarc commented on 23 Mar 2018
// // Turns out there was a misconfiguration in the mongo docker container. We didn't use the env variables specified here: docker-library/mongo#189
// // Now it works! Thanks for your support!
// //
// // landaisgu commented on 25 Feb 2021
// // Try this:
// // await Mongoose.connect('mongodb://admin:1234@server-db:27017/server-db?authSource=admin')
// // If I'm reading this correctly, you're connecting to 'server-db' and trying to authenticate against the 'admin' user that's defined on the 'admin' db. You need to tell MongoDB what database your user is defined on regardless of whether you're using docker or not.
// // Thank you for your help, I had a headache with this issue for my project using .Net Core
// //
// //
// // d220115-2054 connect from docker:mongoose to docker:mongodc NOW WORKS !!!!
// // mongo-express-52_1  ==[gives]==>  "platform":"'Node.js v12.22.7, LE (legacy)"
// // apiserver_1         ==[gives]==>  "platform":"Node.js v16.13.2, LE (unified)"
// // see:// https://medium.com/@skleeschulte/how-to-enable-ipv6-for-docker-containers-on-ubuntu-18-04-c68394a219a2
// // --[CWD=~/dev/github/SUM4/docker(git:master)]--[1642276471 20:54:31 Sat 15-Jan-2022 CET]--[jdg@iMac19-jdg71nl]--[hw:Mac,os:MacOS-Big Sur-11.2.3,isa:x86_64]------
// // > docker-compose -f dc--tokenme-apiserver-52.yml up
// // mongo-mydb-52       | {"t":{"$date":"2022-01-15T19:54:36.653+00:00"},"s":"I",  "c":"NETWORK",  "id":22943,   "ctx":"listener","msg":"Connection accepted","attr":{"remote":"192.168.144.4:36628","uuid":"b5d8f3fb-aab2-44c7-b0e9-61c8101aeb31","connectionId":1,"connectionCount":1}}
// // mongo-mydb-52       | {"t":{"$date":"2022-01-15T19:54:36.656+00:00"},"s":"I",  "c":"NETWORK",  "id":51800,   "ctx":"conn1","msg":"client metadata","attr":{"remote":"192.168.144.4:36628","client":"conn1","doc":{"driver":{"name":"nodejs","version":"3.7.3"},"os":{"type":"Linux","name":"linux","architecture":"x64","version":"5.10.76-linuxkit"},"platform":"'Node.js v12.22.7, LE (legacy)"}}}
// // mongo-express-52_1  | Mongo Express server listening at http://0.0.0.0:8081
// // mongo-express-52_1  | Server is open to allow connections from anyone (0.0.0.0)
// // mongo-express-52_1  | basicAuth credentials are "admin:pass", it is recommended you change this in your config.js!
// // apiserver_1         | # server_name = tokenme-apiserver 
// // apiserver_1         | # app_version = 2.1.30 
// // apiserver_1         | # node_version = 16.13.2 
// // apiserver_1         | # mongoose_version = 6.1.5 
// // apiserver_1         | # pub_path =  /home/app/src/pub_build
// // apiserver_1         | # config/env variable: CONFIG_MONGODB_URL=mongodb://mongo-mydb-52:27017
// // apiserver_1         | # config/env variable: CONFIG_MONGODB_HOST=localhost
// // apiserver_1         | # config/env variable: CONFIG_MONGODB_PORT=27017
// // apiserver_1         | # config/env variable: CONFIG_MONGODB_USERNAME=
// // apiserver_1         | # config/env variable: CONFIG_MONGODB_PASSWORD=
// // apiserver_1         | # config/env variable: CONFIG_APP_PORT=8180
// // apiserver_1         | # trying to connect to MongoDB (uri="mongodb://mongo-mydb-52:27017/tokenme-tst-v2") ...
// // mongo-mydb-52       | {"t":{"$date":"2022-01-15T19:54:36.769+00:00"},"s":"I",  "c":"NETWORK",  "id":22943,   "ctx":"listener","msg":"Connection accepted","attr":{"remote":"192.168.144.3:57100","uuid":"2e14e58e-feea-4d93-baf3-adbd7008ae9a","connectionId":2,"connectionCount":2}}
// // mongo-mydb-52       | {"t":{"$date":"2022-01-15T19:54:36.774+00:00"},"s":"I",  "c":"NETWORK",  "id":51800,   "ctx":"conn2","msg":"client metadata","attr":{"remote":"192.168.144.3:57100","client":"conn2","doc":{"driver":{"name":"nodejs|Mongoose","version":"4.2.2"},"os":{"type":"Linux","name":"linux","architecture":"x64","version":"5.10.76-linuxkit"},"platform":"Node.js v16.13.2, LE (unified)","version":"4.2.2|6.1.6"}}}
// // apiserver_1         | # successfully connected to the database
// //
// // d220121 JDG: maybe solution??
// // https://stackoverflow.com/questions/69840504/mongooseserverselectionerror-connect-econnrefused-127017
// // "I finally solved it. Enabling the IPV6 that MongoDB has disabled by default."
// // https://medium.com/@skleeschulte/how-to-enable-ipv6-for-docker-containers-on-ubuntu-18-04-c68394a219a2

// // https://medium.com/@anuradhs/connect-to-mongodb-docker-container-with-authentication-using-mongoose-and-nodejs-6319bea82e9d
// // const mongoose_connect_uri = 'mongodb://127.0.0.1:27052/tokenme-tst-v2';
// // const mongoose_connect_uri = "mongodb+srv://mdbrootuser:mdbpass822907588@mongo:27052/tokenme-tst-v2";    // https://www.mongodb.com/compatibility/docker
// // const mongoose_connect_uri = "mongodb+srv://mdbrootuser:mdbpass822907588@mongo:27017/tokenme-tst-v2";
// // const mongoose_connect_uri = "mongodb://mongo:27052/tokenme-tst-v2";
// // const mongoose_connect_uri = "mongodb://mongo-mydb-52:27052/tokenme-tst-v2";
// // const mongoose_connect_uri = "mongodb://mongo-mydb-52:27017/tokenme-tst-v2";
// //
// // const mc_dbname = "tokenme-tst-v2";
// const mc_dbname = config.get("CONFIG_MONGODB_DBNAME");
// //
// const mongoose_connect_uri = config.get("CONFIG_MONGODB_URL") + "/" + mc_dbname;
// //
// // const mc_host = config.get("CONFIG_MONGODB_HOST")
// // const mc_port = config.get("CONFIG_MONGODB_PORT")
// // const mc_username = config.get("CONFIG_MONGODB_USERNAME")
// // const mc_password = config.get("CONFIG_MONGODB_PASSWORD")
// // const mongoose_connect_uri = "mongodb://" + mc_username + ":" + mc_password + "@" + mc_host + ":" + mc_port + "/" + mc_dbname;
// //
// console.log(`# trying to connect to MongoDB (uri="${mongoose_connect_uri}") ...`)
// //
// mongoose.Promise = global.Promise;
// // mongoose.connect(mongoose_connect_uri, {
// //     // useNewUrlParser:  true,
// //     // user:             config.get("CONFIG_MONGODB_USERNAME"),
// //     // pass:             config.get("CONFIG_MONGODB_PASSWORD"),
// //     // username:         config.get("CONFIG_MONGODB_USERNAME"),
// //     // password:         config.get("CONFIG_MONGODB_PASSWORD"),
// //     //
// //     // // "auth": { "authSource": "admin" },
// //     // auth: { 
// //     //   authSource: "admin",
// //     //   username: config.get("CONFIG_MONGODB_USERNAME"), 
// //     //   password: config.get("CONFIG_MONGODB_PASSWORD"),
// //     // },
// //     // user: config.get("CONFIG_MONGODB_USERNAME"),
// //     // pass: config.get("CONFIG_MONGODB_PASSWORD"),
// //     // useMongoClient: true,
// //     // // also?:
// //     // authSource: "admin",
// //     // useNewUrlParser: true,
// //     // useUnifiedTopology: true,
// // })
// // mongoose.connect(mongoose_connect_uri)
// mongoose.connect(mongoose_connect_uri, mongoose_connect_options)
// .then(() => {
//     console.log('# successfully connected to the database');
//     f_set_meta_dbconn(true);
// })
// .catch(err => {
//     console.error( "ERROR: could not connect to MongoDB. err.json = ", JSON.stringify(err) );
//     f_set_meta_dbconn(false);
//     //
//     const after_mongoose_error_keep_open = true;
//     //
//     if (after_mongoose_error_keep_open) {
//       console.log("# we wanna 'after_mongoose_error_keep_open' so we don't do 'process.exit(1)' ...");
//       // process.exit(1);
//     } else {
//       process.exit(1);
//     }
// });

// // d220108-1824-PST node inside container just exits with this error:
// // /home/app/node_modules/mongoose/lib/connection.js:797
// //   const serverSelectionError = new ServerSelectionError();
// // MongooseServerSelectionError: getaddrinfo ENOTFOUND mongo-mydb-52

// // const mongodb_localhost_wtc_nd_test = 'mongodb://localhost/wtc-nd-test';

// ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------
// 

// // https://www.npmjs.com/package/node-couchdb
// // https://github.com/1999/node-couchdb
// // https://node-couchdb.readthedocs.io/en/latest/
// // https://www.w3schools.blog/node-js-couchdb-tutorial
// //
// const NodeCouchDB = require('node-couchdb');    // npm install node-couchdb --save
// //
// const cc_db_url   = config.get("CONFIG_COUCHDB_URL");
// const cc_db_prot  = config.get("CONFIG_COUCHDB_PROT");
// const cc_db_host  = config.get("CONFIG_COUCHDB_HOST");
// const cc_db_port  = config.get("CONFIG_COUCHDB_PORT");
// const cc_username = config.get("CONFIG_COUCHDB_USER");
// const cc_password = config.get("CONFIG_COUCHDB_PASSWORD");
// //
// // node-couchdb instance with default options
// const couchdb = new NodeCouchDB(
//   {
//     protocol: cc_db_prot,
//     host:     cc_db_host,
//     port:     cc_db_port,
//     auth:{  
//       user:     cc_username, 
//       password: cc_password  
//     }  
//   }
// );  
// //
// couchdb.listDatabases()
// .then(dbs => {  
//   console.log("# couchdb.listDatabases() = " + JSON.stringify(dbs) );  
// });  

// let   cc_db_url   = config.get("CONFIG_COUCHDB_URL");
// const cc_db_prot  = config.get("CONFIG_COUCHDB_PROT");
// const cc_db_host  = config.get("CONFIG_COUCHDB_HOST");
// const cc_db_port  = config.get("CONFIG_COUCHDB_PORT");
// const cc_username = config.get("CONFIG_COUCHDB_USER");
// const cc_password = config.get("CONFIG_COUCHDB_PASSWORD");
// if (!cc_db_url && cc_db_prot && cc_username && cc_password && cc_db_host && cc_db_port) {
//   cc_db_url = `${cc_db_prot}://${cc_username}:${cc_password}@${cc_db_host}:${cc_db_port}`;
// }
// console.log("# DB connect URL = " + cc_db_url);

// const db_singleton = require('./lib/db_singleton.js');
// const startup_db = async function() {
//   await db_singleton.open_connection(cc_db_url)
//     .then(result => console.log("# DB connect: Success, message = ", result))
//     .catch(err => {
//       console.log("# DB connect: Error, message = ", err.message);
//       process.exit(1);
//     });
//   //
// };
// startup_db();
// startup_db();

// const db_singleton = require('./lib/db_singleton.js');
// async function func_async_open_db() {
//   await db_singleton.open_connection(cc_db_url)
//   .then(result => console.log("# DB connect: Success, message = ", result))
//   .catch(err => {
//     console.log("# DB connect: Error, message = ", err.message);
//     process.exit(1);
//   });
// };
// func_async_open_db();

// // const my_url  = db_singleton.url;
// // const my_nano = db_singleton.nano;
// const nano = db_singleton.nano;
// //
// async function func_async_db_test() {
//   const info = await nano.db.get('alice')
//     // await nano.db.destroy('alice')
//   // await nano.db.create('alice')
//   // const alice = nano.use('alice')
//   // const response = await alice.insert({ happy: true }, 'rabbit')
//   const testdb = nano.use('testdb')
//   const response = await testdb.insert({ happy: true }, 'rabbit')
//   return response
// }
// const result = func_async_db_test();
// console.log("# ", result);

// ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------

function isObject(val) {
  if (val === null) { return false;}
  return ( (typeof val === 'function') || (typeof val === 'object') );
}

// from TCNC course: 2 ways to read 'NODE_ENV' environment variable:
// process.env.NODE_ENV   // 'undefined'   if not defined
// app.get('env')         // 'development' if not defined

// // /Users/jdg/dev/DB-Dev/node.js-course-zip/4.1- Express/after/index.js
// console.log('Application Name: ' + config.get('name'));
// console.log('Mail Server: ' + config.get('mail.host'));
// console.log('Mail Password: ' + config.get('mail.password'));
// // 
// if (app.get('env') === 'development') {
//   app.use(morgan('tiny'));
//   debug('Morgan enabled...');
// }

// ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------

// MQTT
// > mosquitto_sub -h mqtt.techtenna.com -t Sostark/# -u Sostark -P '+zW7@LVveQ6Q?k8s' -p 8883 --capath /etc/ssl/certs
// > mosquitto_sub --help
// mosquitto_sub is a simple mqtt client that will subscribe to a set of topics and print all messages it receives.
// mosquitto_sub version 1.5.7 running on libmosquitto 1.5.7.
// -h : mqtt host to connect to. Defaults to localhost.
// -i : id to use for this client. Defaults to mosquitto_sub_ appended with the process id.
// -I : define the client id as id_prefix appended with the process id. Useful for when the broker is using the clientid_prefixes option.
// -k : keep alive in seconds for this client. Defaults to 60.
// -L : specify user, password, hostname, port and topic as a URL in the form: mqtt(s)://[username[:password]@]host[:port]/topic
// -N : do not add an end of line character when printing the payload.
// -p : network port to connect to. Defaults to 1883 for plain MQTT and 8883 for MQTT over TLS.
// -P : provide a password
// -q : quality of service level to use for the subscription. Defaults to 0.
// -R : do not print stale messages (those with retain set).
// -t : mqtt topic to subscribe to. May be repeated multiple times.
// -T : topic string to filter out of results. May be repeated.
//
// var mqtt = require('mqtt');    // npm install mqtt --save  // guide => https://github.com/mqttjs/MQTT.js
// var mqtt_client  = mqtt.connect('mqtt://test.mosquitto.org')
// mqtt_client.on('connect', function () {
//   mqtt_client.subscribe('presence', function (err) {
//     if (!err) {
//       mqtt_client.publish('presence', 'Hello mqtt')
//     }
//   })
// })
// mqtt_client.on('message', function (topic, message) {
//   // message is Buffer
//   console.log(message.toString())
//   mqtt_client.end()
// })

// ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------

// export, because 'app' is used in: bin/www (which is top-level of program start: nmp start)
// module.exports = app;
module.exports = {
  app:          app,
  // app_hash:  app_hash,
  http_server:  http_server,   // is picked-up in ./bin/www
  // socket_io:    socket_io,
  // f_socket_io_emit_api_do_refresh: f_socket_io_emit_api_do_refresh,
  // get_socket_io: get_socket_io,
}; 

// ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------ = ------+++------
//-EOF
