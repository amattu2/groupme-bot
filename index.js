// Files
var http = require('http');
var director = require('director');
var bots = {
  md: require('./bots/md.js'),
  example: require('./bots/example.js'),
  nmanning: require('./bots/nmanning.js'),
  lherman: require("./bots/l-herman.js"),
  statusReport: require('./bots/status-report.js')
};

// Setup routes
var router = new director.http.Router({
  '/md': {
    post: bots.md.handler
  },
  '/example': {
    post: bots.example.handler
  },
  '/nmanning': {
    post: bots.nmanning.handler
  },
  '/l-herman': {
    post: bots.lherman.handler
  },
  '/status-report': {
    post: bots.statusReport.handler
  }
});

// Setup server
var server = http.createServer(function(req, res) {
  // Variables
  req.chunks = [];

  // Events
  req.on('data', function(chunk) {
    req.chunks.push(chunk.toString());
  });
  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});
var port = Number(process.env.PORT || 5000);
server.listen(port);
