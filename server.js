"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const router = new Router({ mergeParams: true });
let messages = [];

router.use(bodyParser.json());

router.get('/', (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end('Hello, World!');
});

router.get('/messages', (request, response) => {
  let allMessages = JSON.stringify(messages);
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (request.url.includes('?encrypt=true')) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return bcrypt.hash(allMessages, 10, (err, hash) => {
      response.end(hash);
    });
  };
  response.end(allMessages);
});

router.get('/message/:id', (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const foundMessage = messages.find(message => {
    return message.id == request.params.id;
  })
  if (request.url.includes('?encrypt=true')) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return bcrypt.hash(foundMessage, 10, (err, hash) => {
      response.end(hash);
    });
  };
  response.end(JSON.stringify(foundMessage));
});

router.post('/message', (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  messages.push(request.body)
  response.end(JSON.stringify(request.body.id));
});

const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function(port, callback) {
  server.listen(port, callback);
};

exports.close = function(callback) {
  server.close(callback);
};
