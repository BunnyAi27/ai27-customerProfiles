#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { customerProfileStack } = require('../lib/customer-profile-stack');



const app = new cdk.App();
const env = app.node.tryGetContext('environment')
const envVariables = app.node.tryGetContext(env)

new customerProfileStack(app, 'customerProfileStack', {

  env: { account: envVariables.accountId, region: envVariables.region },

}, envVariables);
