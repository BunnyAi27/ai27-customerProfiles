const connectProfilesHelper = require("./helpers/connectProfilesHelper");
const responseBuilder = require("./helpers/responseBuilder");
const getTenantConfiguration = require("./helpers/getTenantConfiguration");

exports.handler = async (event) => {
  // TODO implement
  console.log("Event", JSON.stringify(event));
  let tenantId = event.headers.tenantId.toLowerCase();
  const tenantConfig = await getTenantConfiguration(tenantId);

  try {
    switch (tenantConfig.Item.dataSource.toLowerCase()) {
      case "connect":
        return await connectProfilesHelper.connectProfileAction(event,tenantConfig);
      case "thirdpart":
        return await connectProfilesHelper.connectProfileAction(event,tenantConfig);
      default:
        return await connectProfilesHelper.connectProfileAction(event,tenantConfig);
    }
  } catch (error) {
    console.error("index: error: ", error);
    const errResp = {
      errorMessage: "Check channel header",
    };
    return responseBuilder.formatResponse(event, 500, errResp);
  }
};
