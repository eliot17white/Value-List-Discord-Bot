/*
keepalive.js
Purpose: Creates an http server for uptimerobot to ping. Allows bot to stay up indefinitely.
Written by Zolohyr
*/

var http = require('http');

http.createServer(function (req, res) {
  res.write("Bot Online");
  res.end();
}).listen(8080);
