const { DynamoDBDocument, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const dynamoDBClient = new DynamoDB();
const ddb = DynamoDBDocument.from(dynamoDBClient);
const responseBuilder = require("./responseBuilder");

const getTenantConfiguration = async (tenantId) => {
  try {
    const input = {
      TableName: process.env.CUSTOMER_PROFILE_TABLE_NAME,
      Key: {
        tenantId: tenantId,
      },
    };
    const command = new GetCommand(input);
    const response = await ddb.send(command);
    console.info("Tenant lookup response: ", response);
    return response;
  } catch (error) {
    console.error("Tenant lookup error: ", error);
    return responseBuilder.formatResponse(tenantId, 400, error);
  }
};

module.exports = {
  getTenantConfiguration,
};
