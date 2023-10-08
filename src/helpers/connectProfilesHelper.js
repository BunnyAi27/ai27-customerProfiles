const {
  CustomerProfilesClient,
  CreateProfileCommand,
  DeleteProfileCommand,
  UpdateProfileCommand,
  SearchProfilesCommand,
} = require("@aws-sdk/client-customer-profiles");
const client = new CustomerProfilesClient();
const responseBuilder = require("./responseBuilder");

const connectProfileAction = async (event, tenantConfig) => {
  let response = "";
  let command = "";
  let params = "";
  const eventBody = JSON.parse(event.body);

  console.info("Params: ", eventBody);
  try {
    switch (event.resource) {
      case "/createCustomerProfile":
        try {
          console.info("Create Params: ", eventBody);
          command = new CreateProfileCommand(eventBody);
          response = await client.send(command);
          console.info("Create response: ", response);
          return responseBuilder.formatResponse(event, 200, response);
        } catch (error) {
          console.error("Create response: ", error);
          return responseBuilder.formatResponse(event, 400, error);
        }

      case "/deleteCustomerProfile":
        try {
          console.info("Delete Params: ", eventBody);
          command = new DeleteProfileCommand(eventBody);
          response = await client.send(command);
          console.info("Delete response: ", response);
          return responseBuilder.formatResponse(event, 200, response);
        } catch (error) {
          console.error("Delete response: ", error);
          return responseBuilder.formatResponse(event, 400, error);
        }

      case "/updateCustomerProfile":
        try {
          console.info("Delete Params: ", eventBody);
          command = new UpdateProfileCommand(eventBody);
          response = await client.send(command);
          console.info("Delete response: ", response);
          return responseBuilder.formatResponse(event, 200, response);
        } catch (error) {
          console.error("Update response: ", error);
          return responseBuilder.formatResponse(event, 400, error);
        }

      case "/searchCustomerProfile":
        try {
          console.info("Search Params: ", eventBody);
          command = new SearchProfilesCommand(eventBody);
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
