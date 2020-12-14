// Files
var HTTPS = require('https');

// Variables
var botID = process.env.BOT_ID;
var botRegex = new RegExp(/(MD)|(Maryland)|(old bay)/gi);
var whereRegex = new RegExp(/(where is md)|(where is maryland)/gi);
var botResponses = ["O.H.I.O. can suck my crab", "I love Maryland", "Yes.", "Bless all of you Marylanders",
  "If you do not live in Maryland, do you even live?", "Did someone say MARYLAND?!?!?!?!", "Put some Old Bay on your lives",
  "If you hate your life, you probably do not live in Maryland", "Herman only curves native born Marylanders"];
var options = {
  hostname: 'api.groupme.com',
  path: '/v3/bots/post',
  method: 'POST'
};

/*
  Standard new message handler
*/
function respond() {
  // Variables
  var request = JSON.parse(this.req.chunks[0]);

  // Status code
  this.res.writeHead(200);

  // Standard validation
  if (request.text && request.sender_type && request.sender_type == "user") {
    // Prompt type
    if (whereRegex.test(request.text)) {
      console.log('Response 1');
      whereResponse();
    } else if (botRegex.test(request.text)) {
      console.log('Response 2');
      botResponse();
    } else {
      console.log("No RegExp matches");
    }
  }

  // End
  this.res.end();
}

/*
  Standard Maryland prompt response
*/
function botResponse() {
  // Variables
  var body = {
    "bot_id": botID,
    "text": botResponses[Math.floor(Math.random() * botResponses.length)]
  };
  var botReq = HTTPS.request(options, function(res) {
    if (res.statusCode != 202) {
      console.log('Message failed to send with a HTTP ' + res.statusCode);
    }
  });

  // Events
  botReq.on('error', function(err) {
    console.log('Message failed to send with a error '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('Message failed to send with a timeout '  + JSON.stringify(err));
  });

  // Send Request
  botReq.end(JSON.stringify(body));
}

/*
  Nonstandard geo coord response
*/
function whereResponse() {
  // Variables
  var body = {
    "bot_id": botID,
    "text": "It's right here, my best friend:",
    "attachments" : [{"type"  : "location", "lat": "39.0458", "lng": "76.6413", "name": "Mother Land, USA"}]
  };
  var botReq = HTTPS.request(options, function(res) {
    if (res.statusCode != 202) {
      console.log('Message failed to send with a HTTP ' + res.statusCode);
    }
  });

  // Events
  botReq.on('error', function(err) {
    console.log('Message failed to send with a error '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('Message failed to send with a timeout '  + JSON.stringify(err));
  });

  // Send Request
  botReq.end(JSON.stringify(body));
}

// Export function
exports.respond = respond;
