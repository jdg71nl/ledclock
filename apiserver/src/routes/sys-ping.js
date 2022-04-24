// sys-ping.js

var express = require('express');
var router = express.Router();

// idea from: https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/

router.get('/', function(req, res, next) {
  // const response_hash = { response: 'API is working properly' };
  // const response_hash = { response: 'Pong .. API working properly!' };
  const response_hash = { response: 'Pong ;-)  -- this API is working properly!' };
  res.meta_send(200, response_hash);
});

module.exports = {router: router};

//-EOF
