const {
  CustomerProfilesClient,
  CreateProfileCommand,
  DeleteProfileCommand,
  UpdateProfileCommand,
  SearchProfilesCommand,
} = require("@aws-sdk/client-customer-profiles");
const client = new CustomerProfilesClient();
const responseBuilder = require("./responseBuilder");
const parameterBuilder = require("./connectParameterBuilder");

const connectProfileAction = async (event, tenantConfig) => {
  let response = "";
  let command = "";
  const eventBody = JSON.parse(event.body);

  console.info("Event Body: ", eventBody);
  try {
    switch (event.resource) {
      case "/createCustomerProfile":
        try {
          const createParams = parameterBuilder.createParameterBuilder(eventBody, tenantConfig)
          console.info("Create Params: ", createParams);
          command = new CreateProfileCommand(createParams);
          response = await client.send(command);
          console.info("Create response: ", response);
          return responseBuilder.formatResponse(event, 200, response);
        } catch (error) {
          console.error("Create response: ", error);
          return responseBuilder.formatResponse(event, 400, error);
        }

      case "/deleteCustomerProfile":
        try {
          const deleteParams = parameterBuilder.deleteParameterBuilder(eventBody, tenantConfig)
          console.info("Delete Params: ", deleteParams);
          command = new DeleteProfileCommand(deleteParams);
          response = await client.send(command);
          console.info("Delete response: ", response);
          return responseBuilder.formatResponse(event, 200, response);
        } catch (error) {
          console.error("Delete response: ", error);
          return responseBuilder.formatResponse(event, 400, error);
        }

      case "/updateCustomerProfile":
        try {
          const updateParams = parameterBuilder.updateParameterBuilder(eventBody, tenantConfig)
          console.info("Update Params: ", updateParams);
          command = new UpdateProfileCommand(updateParams);
          response = await client.send(command);
          console.info("Update response: ", response);
          return responseBuilder.formatResponse(event, 200, response);
        } catch (error) {
          console.error("Update response: ", error);
          return responseBuilder.formatResponse(event, 400, error);
        }

      case "/searchCustomerProfile":
        try {
          const searchParams = parameterBuilder.searchParameterBuilder(eventBody, tenantConfig)
          console.info("Search Params: ", searchParams);
          command = new SearchProfilesCommand(searchParams);
          response = await client.send(command);
          console.info("Search response: ", response);
          return responseBuilder.formatResponse(event, 200, response);
        } catch (error) {
          console.error("Search response: ", error);
          return responseBuilder.formatResponse(event, 400, error);
        }

      default:
        console.info("default case");
    }
  } catch (error) {
    console.error("ConnectProfileAction catch error: ", error);
    return responseBuilder.formatResponse(event, 400, error);
  }
};

module.exports = {
  connectProfileAction,
};
