const {
  CustomerProfilesClient,
  CreateProfileCommand,
  DeleteProfileCommand,
  UpdateProfileCommand,
  SearchProfilesCommand,
} = require("@aws-sdk/client-customer-profiles");
const client = new CustomerProfilesClient();
const responseBuilder = require("./responseBuilder");

const connectProfileAction = async (event) => {
  let response = "";
  let command = "";
  let params = "";
  const eventBody = JSON.parse(event.body);

  console.log("Params: ", eventBody);
  try {
    switch (event.resource) {
      case "/createCustomerProfile":
        try {
          console.log("Create Params: ", eventBody);
          command = new CreateProfileCommand(eventBody);
          response = await client.send(command);
          console.log("Create response: ", response);
          return responseBuilder.formatResponse(event, 200, response);
        } catch (error) {
          console.error("Create response: ", error);
          return responseBuilder.formatResponse(event, 400, error);
        }

      case "/deleteCustomerProfile":
        try {
          console.log("Delete Params: ", eventBody);
          command = new DeleteProfileCommand(eventBody);
          response = await client.send(command);
          console.log("Delete response: ", response);
          return responseBuilder.formatResponse(event, 200, response);
        } catch (error) {
          console.error("Delete response: ", error);
          return responseBuilder.formatResponse(event, 400, error);
        }

      case "/updateCustomerProfile":
        try {
          console.log("Delete Params: ", eventBody);
          command = new UpdateProfileCommand(eventBody);
          response = await client.send(command);
          console.log("Delete response: ", response);
          return responseBuilder.formatResponse(event, 200, response);
        } catch (error) {
          console.error("Update response: ", error);
          return responseBuilder.formatResponse(event, 400, error);
        }

      case "/searchCustomerProfile":
        try {
          console.log("Search Params: ", eventBody);
          command = new SearchProfilesCommand(eventBody);
          response = await client.send(command);
          console.log("Search response: ", response);
          return responseBuilder.formatResponse(event, 200, response);
        } catch (error) {
          console.error("Search response: ", error);
          return responseBuilder.formatResponse(event, 400, error);
        }

      default:
        console.log("default case");
    }
  } catch (error) {
    console.error("ConnectProfileAction catch error: ", error);
    return responseBuilder.formatResponse(event, 400, error);
  }
};

module.exports = {
  connectProfileAction,
};
