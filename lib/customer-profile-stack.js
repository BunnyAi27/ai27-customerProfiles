const { Stack, Duration } = require("aws-cdk-lib");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const lambda = require("aws-cdk-lib/aws-lambda");
const iam = require("aws-cdk-lib/aws-iam");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const cognito = require("aws-cdk-lib/aws-cognito");
const logs = require("aws-cdk-lib/aws-logs");

class customerProfileStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props, envVariables) {
    super(scope, id, props, envVariables);

    //Call environment variable here
    console.log("env variables: ", envVariables);
    const prefix = envVariables.prefix;
    const env = envVariables.environment;
    const featureName = envVariables.featureName;
    const region = envVariables.region;
    const accountId = envVariables.accountId;
    const userPool = envVariables.cognitoAPIUserPool;
    const authScopeCreate = envVariables.authScopeCreate;
    const authScopeUpdate = envVariables.authScopeUpdate;
    const authScopeDelete = envVariables.authScopeDelete;
    const authScopeSearch = envVariables.authScopeSearch;

    //DynamoDB table to store tenant specific information
    const customerProfileTable = new dynamodb.TableV2( this,"ai27-" + env + "-customerProfile-table",
      {
        tableName: prefix + "-" + env + "-" + featureName,
        partitionKey: { name: "tenantId", type: dynamodb.AttributeType.STRING },
      }
    );

    //Role to provide lambda access to dynamodb table, cloudwatch and connect
    const customerProfilRole = new iam.Role( this, "ai27-" + env + "-customerProfile-role",
      {
        roleName: prefix + "-" + env + "-" + featureName,
        assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      }
    );

    customerProfilRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          "profile:DeleteProfileObject",
          "profile:SearchProfiles",
          "profile:CreateProfile",
          "profile:UpdateProfile",
          "profile:DeleteProfile",
        ],
        resources: [
          "arn:aws:profile:" + region + ":" + accountId + ":domains/*",
          "arn:aws:profile:" +
            region +
            ":" +
            accountId +
            ":domains/*/object-types/*",
        ],
      })
    );

    customerProfilRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaBasicExecutionRole"
      )
    );

    //Lambda function to create customer profile
    const customerProfileLambda = new lambda.Function( this,"ai27-" + env + "-customerProfile-lambda",
      {
        functionName: prefix + "-" + env + "-" + featureName,
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset("src"),
        role: customerProfilRole,
        environment: {
          CUSTOMER_PROFILE_TABLE_NAME: prefix + "-" + env + "-" + featureName,
        },
      }
    );

    // Provide access to dynamodb table for lambda function
    customerProfileTable.grantWriteData(customerProfileLambda);
    customerProfileTable.grantReadData(customerProfileLambda);

    const cognitoAPIUserPool = cognito.UserPool.fromUserPoolArn( this, "ai27-" + env + "-customerProfile-userPool",
      userPool
    );

    const apiAuth = new apigateway.CognitoUserPoolsAuthorizer( this, "ai27-" + env + "-customerProfile-apiAuth",
      {
        authorizerName: prefix + "-" + env + "-" + featureName,
        cognitoUserPools: [cognitoAPIUserPool],
      }
    );

    const apiLogGroup = new logs.LogGroup( this, "ai27-" + env + "-customerProfile-apiLogs"
    );

    //API gateway for customer profile actions
    const customerProfileApiGateway = new apigateway.LambdaRestApi( this, "ai27-" + env + "-customerProfile-apiGateway",
      {
        restApiName: prefix + "-" + env + "-" + featureName,
        handler: customerProfileLambda,
        proxy: false,
        deployOptions: {
          stageName: "dev",
          accessLogDestination: new apigateway.LogGroupLogDestination(
            apiLogGroup
          ),
          accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
            caller: false,
            httpMethod: true,
            ip: true,
            protocol: true,
            requestTime: true,
            resourcePath: true,
            responseLength: true,
            status: true,
            user: true,
          }),
        },
      }
    );

    new apigateway.RestApi(this, "ai27-" + env + "-customerProfile-apiGateway-Cors", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS, // this is also the default
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token', 'X-Amz-User-Agent']  // this is also the default
      }
    })

    API_Lambda_Integration = new apigateway.LambdaIntegration(customerProfileLambda,
      requestTemplates= {
        "application/json": '{ "statusCode": "200" }',
      }
    );

    apiAuth._attachToApi(customerProfileApiGateway);

    const createProfile = customerProfileApiGateway.root.addResource("createCustomerProfile");
    createProfile.addMethod("POST"),
      {
        authorizationType: apigateway.AuthorizationType.COGNITO,
        authorizer: apiAuth,
        authorizationScopes: [authScopeCreate],
      };

    const deleteProfile = customerProfileApiGateway.root.addResource("deleteCustomerProfile");
    deleteProfile.addMethod("POST"),
      {
        authorizationType: apigateway.AuthorizationType.COGNITO,
        authorizer: apiAuth,
        authorizationScopes: [authScopeDelete],
      };

    const updateProfile = customerProfileApiGateway.root.addResource("updateCustomerProfile");
    updateProfile.addMethod("POST"),
      {
        authorizationType: apigateway.AuthorizationType.COGNITO,
        authorizer: apiAuth,
        authorizationScopes: [authScopeUpdate],
      };

    const searchProfile = customerProfileApiGateway.root.addResource("searchCustomerProfile");
    searchProfile.addMethod("POST"),
      {
        authorizationType: apigateway.AuthorizationType.COGNITO,
        authorizer: apiAuth,
        authorizationScopes: [authScopeSearch],
      };
  }
}

module.exports = { customerProfileStack };