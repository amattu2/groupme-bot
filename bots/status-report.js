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
    Prompt: new RegExp(/(status report)|(!studyguides)/ig),
    Responses: [`Exam 1 Study Guide: https://www.notion.so/CMSC216-Study-Guide-Exam-1-8e0630b29e2a4ebd9d9a2506b95a51f5

Exam 2 Study Guide: https://www.notion.so/CMSC216-EXAM-2-REVIEW-cf5de65b7173481ab83b9f08ab2b9aba

Exam 3 Study Guide: https://www.notion.so/CMSC216-EXAM-3-STUDY-GUIDE-dc271f71da5f4416b6950506dd95d5cf

Study Guide After those: https://www.notion.so/Rest-of-Stuff-4e2d74b41fd644c5a6d6988bcf68e63b`]
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
