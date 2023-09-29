const connectProfilesHelper = require("./helpers/connectProfilesHelper");
const responseBuilder = require("./helpers/responseBuilder");

exports.handler = async (event) => {
  // TODO implement
  console.log("Event", JSON.stringify(event));

  try {
    switch (event.headers.channel.toLowerCase()) {
      case "connect":
        return await connectProfilesHelper.connectProfileAction(event);
      case "thirdpart":
        return await connectProfilesHelper.connectProfileAction(event);
      default:
        return await connectProfilesHelper.connectProfileAction(event);
    }
  } catch (error) {
    console.error("index: error: ", error);
    const errResp = {
      errorMessage: "Check if channel header is passed",
    };
    return responseBuilder.formatResponse(event, 500, errResp);
  }
};
