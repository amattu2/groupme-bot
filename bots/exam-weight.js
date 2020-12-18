// Files
var HTTPS = require('https');
var path = require('path');
var template = require('../assets/templater.js');

// Variables
var filename = path.basename(__filename).replace(".js", "");
var options = {
  hostname: 'api.groupme.com',
  path: '/v3/bots/post',
  method: 'POST'
};
var messagePrompts = [
  {
    Prompt: new RegExp(/((final exam weight)|(final weight)|(16\%)|(what is the exam weight)|(exam weight))/ig),
    Responses: ["My dear friend, {{name}}..The final exam weight is 16 percent of our final."]
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
  messagePrompts.forEach(function(messagePrompt) {
    // Check against prompt
    if (!matched && messagePrompt.Prompt.test(request.text)) {
      // Reply
      matched = true;
      sendReply(messagePrompt.Responses, request);
      return true;
    }
  });

  // Default
  this.res.writeHead(200);
  this.res.end();
}

function sendReply(replyOptions, request) {
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
  var reply = replyOptions[Math.floor(Math.random() * replyOptions.length)];
  var body = {
    "bot_id": process.env[filename],
    "text": template.replace(reply, request)
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
