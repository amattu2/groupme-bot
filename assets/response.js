/**
 * Builds a valid GroupMe API response
 *
 * @param {[string]} str
 * @param {[object]} request
 * @param {[string]} bot_id
 * @return {[object]} a valid POST response
 * @author Alec M. <https://amattu.com>
 * @date 2020-12-19T08:25:11-050
 */
function build(str, request, bot_id) {
  // Check response string
  if (!str || typeof(str) !== "string" || str.length <= 0) {
    console.log("No valid response string provided to response.build()");
    return false;
  }
  // Check request object
  if (!request || typeof(request) !== "object") {
    console.log("No valid HTTP request object provided to response.build()");
    return false;
  }
  // Check bot_id string
  if (!bot_id || typeof(bot_id) !== "string" || bot_id.length <= 0) {
    console.log("No valid bot ID provided to response.build()");
    return false;
  }

  // Variables
  var body = {
    "bot_id": bot_id,
    "text": str,
    "attachments": []
  };
  var user_name = (request.name && typeof(request.name) === "string" ? "@" + request.name.trim() : "");

  // Replace Name
  if (body.text.indexOf("{{user_name}}") >= 0) {
    // Replace placeholder
    body.text = body.text.replace("{{user_name}}", name);

    // Add attachments
    body.attachments.push({
      "type": "mentions",
      "loci": [[body.text.indexOf(name), name.length]],
      "user_ids": [request.sender_id]
    });
  }

  // Return response
  return body;
}

// Export function
exports.build = build;
