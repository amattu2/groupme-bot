// Files
var HTTPS = require('https');
var path = require('path');

// Variables
var filename = path.basename(__filename).replace(".js", "");
var options = {
  hostname: 'api.groupme.com',
  path: '/v3/bots/post',
  method: 'POST'
};
var responses = [
  {
    Prompt: new RegExp(/(((md)|(maryland))[\s]?\?)/ig),
    Responses: ["Yes?", "What can I do for you, my love?", "Put some respec on my name",
      "Hello.", "That do be my name."]
  },
  {
    Prompt: new RegExp(/(MD)|(Maryland)|(old bay)/ig),
    Responses: ["O.H.I.O. can suck my crab", "I love Maryland", "Yes.", "Bless all of you Marylanders",
      "If you do not live in Maryland, do you even live?", "Did someone say MARYLAND?!?!?!?!", "Put some Old Bay on your lives",
      "If you hate your life, you probably do not live in Maryland", "Herman only curves native born Marylanders",
      "The Maryland flag turns me on", "No.", "I won the MD vs. OH poll."]
  }
];

/*
  Standard new message handler
*/
function handler() {
  // Variables
  var request = JSON.parse(this.req.chunks[0]);
  var matched = false;

  // Standard request validation
  if (!request.text || !request.sender_type || request.sender_type != "user") {
    this.res.writeHead(200);
    this.res.end();
    return false;
  }

  // Find correct prompt
  responses.forEach(function(response) {
    // Check against prompt
    if (!matched && response.Prompt.test(request.text)) {
      // Reply
      matched = true;
      sendReply(response.Responses);
      return true;
    }
  });

  // Default
  this.res.writeHead(200);
  this.res.end();
}

function sendReply(replyOptions) {
  // Validate replyOptions parameter
  if (!replyOptions || !(replyOptions instanceof Array) || replyOptions.length < 1) {
    console.log("No valid reply options provided");
    return false;
  }
  // Validate BOT_ID environment variable
  if (!process.env[filename] || typeof(process.env[filename]) !== "string") {
    console.log("No valid BOT_ID found in environment variables");
    return false;
  }

  // Variables
  var body = {
    "bot_id": process.env[filename],
    "text": replyOptions[Math.floor(Math.random() * replyOptions.length)]
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
exports.handler = handler;
