const formatResponse = (event, code, response) => {
  const formattedresponse = {
    statusCode: code,
    body: JSON.stringify(response),
  };
  if (event.stageVariables) {
    const headers = responseBuilder(event.stageVariables);
    formattedresponse.headers = headers;
  }
  console.log(JSON.stringify(formattedresponse));
  return formattedresponse;
};

module.exports = {
  formatResponse,
};
