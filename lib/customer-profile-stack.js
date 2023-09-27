const { Stack, Duration } = require('aws-cdk-lib');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const lambda = require('aws-cdk-lib/aws-lambda');
const iam = require('aws-cdk-lib/aws-iam');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const { handler } = require('../src');

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
    console.log("env variables: ", envVariables)

    //DynamoDB table to store tenant specific information
    const customerProfileTable = new dynamodb.TableV2(this, 'ai27-customerProfile-table', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
    });

    //Role to provide lambda access to dynamodb table, cloudwatch and connect
    const customerProfilRole = new iam.Role(this, 'ai27-customerProfile-role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // role.addToPolicy(new iam.PolicyStatement({
    //   actions: [/* whatever actions you want */],
    //   resources: [/* whatever resources you intend to touch */],
    // }));

    customerProfilRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));

    //Lambda function to create customer profile
    const customerProfileLambda = new lambda.Function(this, 'ai27-customerProfile-lambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(__dirname),
      role: customerProfilRole
    });

    customerProfileTable.grantWriteData(customerProfileLambda);

    //API gateway to create customer profile
    const customerProfileApiGateway = new apigateway.LambdaRestApi(this, 'ai27-customerProfile-apiGateway',{
    handler: customerProfileLambda,
    proxy: false
  });

    const createProfile = customerProfileApiGateway.root.addResource('createProfile');
    createProfile.addMethod('POST');

  }
}

module.exports = { customerProfileStack }
