const formatResponse = (event, code, response) => {
  const formattedResponse = {
    statusCode: code,
    body: JSON.stringify(response),
  };
  if (event.stageVariables) {
    const headers = responseBuilder(event.stageVariables);
    formattedResponse.headers = headers;
  }
  console.log(JSON.stringify(formattedResponse));
  return formattedResponse;
};

module.exports = {
  formatResponse,
};
