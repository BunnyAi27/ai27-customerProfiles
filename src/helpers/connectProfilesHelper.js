const { CustomerProfilesClient, CreateProfileCommand, DeleteProfileCommand, UpdateProfileCommand, SearchProfilesCommand } = require("@aws-sdk/client-customer-profiles")
const client = new CustomerProfilesClient();
const responseBuilder = require('./helpers/responseBuilder');

const connectProfileAction = async (event) => {
    let response= "";
    let command = "";
    let params = "";
    const eventBody = JSON.parse(event.body)
    
    console.log("Params: ", eventBody)
    try {
        switch (event.resource) {
            case (event.resource.includes('createCustomerProfile')):
                 
                console.log("Create Params: ", eventBody)
                command = new CreateProfileCommand(eventBody);
                response = await client.send(command);
                console.log("Create response: ", response)
                return responseBuilder.formatResponse(event, 200, response);

            case (event.resource.includes('deleteCustomerProfile')):
                 
                console.log("Delete Params: ", eventBody)
                command = new DeleteProfileCommand(eventBody);
                response = await client.send(command);
                console.log("Delete response: ", response);
                return responseBuilder.formatResponse(event, 200, response);

            case (event.resource.includes('updateCustomerProfile')):
                
                console.log("Delete Params: ", eventBody)
                command = new UpdateProfileCommand(eventBody);
                response = await client.send(command);
                console.log("Delete response: ", response);
                return responseBuilder.formatResponse(event, 200, response);

            case (event.resource.includes('getCustomerProfile')):
                params = {

                }
                console.log("Get Params: ", params)
                command = new SearchProfilesCommand(params);
                response = await client.send(command);
                console.log("Get response: ", response);
                return responseBuilder.formatResponse(event, 200, response);
            default:
                console.log("default case")
        }
    } catch (error) {
        console.error("ConnectProfileAction catch error: ",error)
        return responseBuilder.formatResponse(event, 400, error);
    }

}


module.exports = {
    connectProfileAction,
  }