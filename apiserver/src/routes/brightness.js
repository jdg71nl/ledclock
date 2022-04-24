//= brightness.js

// GET  ==>   curl http://ledclock.dgt-bv.com:8080/api/brightness
// POST ==>   curl -X POST -H "Content-Type: application/json" -d '{"bstep":5}' http://ledclock.dgt-bv.com:8080/api/brightness

const express = require('express');
const fs = require('fs');

const brightness_router = express.Router();

const bstep_file = "/home/jdg/prod/ledclock/bstep.json";

// - - - - - - = = = - - - - - - 
brightness_router.get('/', async (req, res) => {
  let response_hash = {};
  try {
    const bstep_contents = fs.readFileSync(bstep_file, 'utf8');
    const bstep_data = JSON.parse(bstep_contents);
    const bstep = bstep_data.bstep || undefined;
    if (bstep) {
      response_hash = { bstep: bstep };
    } else {
      response_hash = { error: "illigal file entry." };
    }
    res.meta_send(200, response_hash);
  }
  catch (error) {
    response_hash = { error: error };
    res.meta_send(400, response_hash);
  }
});

// - - - - - - = = = - - - - - - 
brightness_router.get('/:id', async (req, res) => {
  let response_hash = { "response": "not implemented."};
  res.meta_send(200, response_hash);
});

// - - - - - - = = = - - - - - - 
brightness_router.post('/', async (req, res) => {
  let response_hash = {};
  // let query_limit   = req.query.limit || undefined;
  // let qint_limit    = parseInt(query_limit, 10) || default_limit;     // qint = query_int (converted)
  let bstep = req.body.bstep || undefined;
  try {
    const bstep_data = {bstep: bstep};
    const bstep_contents = JSON.stringify(bstep_data, null, 4);
    fs.writeFileSync(bstep_file, bstep_contents, 'utf8');
    response_hash = { bstep: bstep };
    res.meta_send(200, response_hash);
    //
  }
  catch (error) {
    response_hash = { error: error };
    res.meta_send(400, response_hash);
  }
});

// - - - - - - = = = - - - - - - 
brightness_router.put('/:id', async (req, res) => {
  let response_hash = { "response": "not implemented."};
  res.meta_send(200, response_hash);
});

// - - - - - - = = = - - - - - - 
brightness_router.delete('/:id', async (req, res) => {
  let response_hash = { "response": "not implemented."};
  res.meta_send(200, response_hash);
});

module.exports = {
  router: brightness_router,
};

//-EOF