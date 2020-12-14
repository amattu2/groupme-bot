// Files
var HTTPS = require('https');
var path = require('path');
var template = require('../assets/templater.js');

// Variables
var filename = path.basename(__filename).replace(".js", ""); // Used to find BOT_ID
var options = {
  hostname: 'api.groupme.com',
  path: '/v3/bots/post',
  method: 'POST'
};
var responses = [
  {
    Prompt: new RegExp(/((\!fact)[\s]?[1-2])/ig),
    Responses: ["Random fact 1", "Random fact 2"]
  }
];

/**
 * Bot reply handler
 *
 * @return bool success
 * @author Alec M. <https://amattu.com>
 * @date 2020-12-14T17:32:57-050
 */
function handler() {
  // Variables
  var request = JSON.parse(this.req.chunks[0]);

  // Standard request validation
  if (!request.text || !request.sender_type || request.sender_type != "user") {
    console.log("No response sent, either the sender was a bot, or the message wasnt text");
    this.res.writeHead(200); // HTTP 200
    this.res.end(); // End HTTP Output
    return false; // Dont continue code
  }

  // Check against prompt
  if (matched && responses[0].Prompt.test(request.text)) {
    // Variables
    var factNumber = parseInt(request.text.split(" ")[1]); // split command message

    // Reply to message
    sendReply(responses[0].Responses[factNumber - 1], request); // text, original request
  }

  // Default
  this.res.writeHead(200); // HTTP 200
  this.res.end(); // End HTTP output
  return true; // default response
}

/**
 * Submit XHR reply to GroupMe API
 *
 * @param string replyMessage
 * @param object request
 * @author Alec M. <https://amattu.com>
 * @date 2020-12-14T17:32:23-050
 */
function sendReply(replyMessage, request) {
  // Validate replyMessage parameter
  if (!replyMessage || typeof(replyMessage) !== "string" || replyMessage.length < 1) {
    console.log("Reply message was not a string or empty");
    return false; // prevent continuation
  }
  // Validate BOT_ID environment variable
  if (!process.env[filename] || typeof(process.env[filename]) !== "string") {
    console.log("No valid bot ID found in environment variables");
    return false; // prevent continuation
  }

  // Variables
  var body = {
    "bot_id": process.env[filename], // GroupMe Bot ID
    "text": replyMessage // Message to send to GroupMe
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
