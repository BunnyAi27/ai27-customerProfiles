const formatResponse = (event, code, response) => {
  const formattedResponse = {
    statusCode: code,
    body: JSON.stringify(response),
  };

  let headers = {
    "Content-Type" : "application/json",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Authorization",
    "Access-Control-Allow-Methods":"GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Origin" : "*",
    // "X-Content-Type-Option" : "nosniff",
    // "X-frame-options" : "DENY",
    // "X-XSS-protection" : 1,
    // "Access-Control-Max-Age":  3600,
    // "Cache-Control" : "no-cache, no-store, max-age=0, must-revalidate"
  };
  //TODO can pull headers from API stage Variables
  // if (event.stageVariables) {
  //   const headers = responseBuilder(event.stageVariables);
  //   formattedResponse.headers = headers
  // }

  formattedResponse.headers = headers;
  console.log(JSON.stringify(formattedResponse));
  return formattedResponse;
};

module.exports = {
  formatResponse,
};
