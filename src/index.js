const connectProfilesHelper = require("./helpers/connectProfilesHelper");
const responseBuilder = require("./helpers/responseBuilder");
const { getTenantConfiguration } = require("./helpers/getTenantConfig");

exports.handler = async (event) => {
  // TODO implement
  console.info("Event", JSON.stringify(event));
  const tenantId = event.headers.tenantId.toLowerCase();
  const tenantConfig = await getTenantConfiguration.getTenantConfiguration(tenantId);

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
      errorMessage: "An Error occurred please contact your administrator",
    };
    return responseBuilder.formatResponse(event, 500, errResp);
  }
};