function replace(str, request) {
  // Placeholder values
  var name = (request.name && typeof(request.name) === "string" ? request.name.substr(0, 20) : "");

  // Replace Name
  str = str.replaceAll("{{name}}", name);

  // Return
  return str;
}

// Export function
exports.replace = replace;
