function replace(str, request) {
  // Placeholder values
  var name = (request.name && typeof(request.name) === "string" ? request.name.substr(0, 20) : "");

  // Replace Name
  str = str.replace("{{name}}", name.trim());

  // Return
  return str;
}

// Export function
exports.replace = replace;
