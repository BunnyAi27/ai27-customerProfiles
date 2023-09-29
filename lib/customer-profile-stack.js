const { Stack, Duration } = require("aws-cdk-lib");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const lambda = require("aws-cdk-lib/aws-lambda");
const iam = require("aws-cdk-lib/aws-iam");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const cognito = require("aws-cdk-lib/aws-cognito");
const logs = require("aws-cdk-lib/aws-logs");
const { handler } = require("../src");

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

    //DynamoDB table to store tenant specific information
    const customerProfileTable = new dynamodb.TableV2(
      this,
      "ai27-"+ env +"-customerProfile-table",
      {
        tableName: prefix + "-" + env + "-" + featureName,
        partitionKey: { name: "tenantId", type: dynamodb.AttributeType.STRING },
      }
    );

    //Role to provide lambda access to dynamodb table, cloudwatch and connect
    const customerProfilRole = new iam.Role(this, "ai27-"+ env +"-customerProfile-role", {
      roleName: prefix + "-" + env + "-" + featureName,
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    customerProfilRole.addToPolicy(new iam.PolicyStatement({
      actions: ["profile:DeleteProfileObject",
      "profile:SearchProfiles",
      "profile:CreateProfile",
      "profile:UpdateProfile"],
      resources: 'arn:aws:profile:'+ region +':'+ accountId +':domains/*',
    }));

    customerProfilRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaBasicExecutionRole"
      )
    );

    //Lambda function to create customer profile
    const customerProfileLambda = new lambda.Function(
      this,
      "ai27-"+ env +"-customerProfile-lambda",
      {
        functionName: prefix + "-" + env + "-" + featureName,
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset('src'),
        role: customerProfilRole,
      }
    );

    customerProfileTable.grantWriteData(customerProfileLambda);

    const cognitoAPIUserPool = cognito.UserPool.fromUserPoolArn(this, "ai27-"+ env +"-customerProfile-userPool", userPool)
    
    const apiAuth = new apigateway.CognitoUserPoolsAuthorizer(this, "ai27-"+ env +"-customerProfile-apiAuth", {
      cognitoUserPools: [cognitoAPIUserPool],
    })

    const apiLogGroup = new logs.LogGroup(this, "ai27-"+ env +"-customerProfile-apiLogs");
    
    //API gateway for customer profile actions
    const customerProfileApiGateway = new apigateway.LambdaRestApi(this,"ai27-"+ env +"-customerProfile-apiGateway",{
        restApiName: prefix + "-" + env + "-" + featureName,
        handler: customerProfileLambda,
        proxy: false,
        deployOptions: {
          stageName: "dev",
          accessLogDestination: new apigateway.LogGroupLogDestination(apiLogGroup),
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
        }
      });

    apiAuth._attachToApi(customerProfileApiGateway)

    const createProfile = customerProfileApiGateway.root.addResource("createProfile");
    createProfile.addMethod("POST"),{
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: apiAuth
    }

    const deleteProfile = customerProfileApiGateway.root.addResource("deleteProfile");
    deleteProfile.addMethod("POST"),{
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: apiAuth
    }

    const updateProfile = customerProfileApiGateway.root.addResource("updateProfile");
    updateProfile.addMethod("POST"),{
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: apiAuth
    }

    const searchProfile = customerProfileApiGateway.root.addResource("searchProfile");
    searchProfile.addMethod("POST"),{
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: apiAuth
    }
  }
}

module.exports = { customerProfileStack };
