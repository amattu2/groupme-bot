// Files
var http = require('http');
var director = require('director');
var bots = {
  md: require('./bots/md.js'),
  test: require('./bots/test.js')
};

// Setup routes
var router = new director.http.Router({
  '/': {
    get: function() {
      this.res.writeHead(200);
      this.res.end();
    }
  },
  '/md': {
    post: bots.md.handler
  },
  '/test': {
    post: bots.test.handler
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
