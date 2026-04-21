import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { cdkStack } from './custom/filterresolver/resource';
import { cdkStack as financereport_cdkStack } from './custom/financereport/resource';
import { financetrackerfinal82393814 } from './function/financetrackerfinal82393814/resource';
import { defineBackend } from '@aws-amplify/backend';
import { Duration } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
  data,
  storage,
  financetrackerfinal82393814,
});
const cfnUserPool = backend.auth.resources.cfnResources.cfnUserPool;
cfnUserPool.usernameAttributes = ['email'];
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 8,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSymbols: false,
    temporaryPasswordValidityDays: 7,
  },
};
const userPool = backend.auth.resources.userPool;
userPool.addClient('NativeAppClient', {
  refreshTokenValidity: Duration.days(30),
  enableTokenRevocation: true,
  enablePropagateAdditionalUserContextData: false,
  authSessionValidity: Duration.minutes(3),
  disableOAuth: true,
  generateSecret: false,
});
const dataStack = backend.data.resources.cfnResources.cfnGraphqlApi.stack;
new cdkStack(dataStack, 'customresolver', backend);
const financeCustom = new financereport_cdkStack(
  backend.createStack('financereport'),
  'financereport'
);

backend.financetrackerfinal82393814.addEnvironment('MONTHLY_REPORT_TOPIC_ARN', financeCustom.monthlyReportTopic.topicArn);
backend.financetrackerfinal82393814.addEnvironment('BUDGET_ALERT_TOPIC_ARN', financeCustom.budgetAlertTopic.topicArn);

const branchName = process.env.AWS_BRANCH ?? 'sandbox';
backend.financetrackerfinal82393814.resources.cfnResources.cfnFunction.functionName = `financetrackerfinal82393814-${branchName}`;
backend.financetrackerfinal82393814.addEnvironment(
  'API_FINANCETRACKERFINAL_GRAPHQLAPIIDOUTPUT',
  backend.data.apiId
);
backend.financetrackerfinal82393814.addEnvironment(
  'API_FINANCETRACKERFINAL_TRANSACTIONTABLE_ARN',
  backend.data.resources.tables['Transaction'].tableArn
);
backend.financetrackerfinal82393814.addEnvironment(
  'API_FINANCETRACKERFINAL_TRANSACTIONTABLE_NAME',
  backend.data.resources.tables['Transaction'].tableName
);
backend.data.resources.tables['Transaction'].grant(
  backend.financetrackerfinal82393814.resources.lambda,
  'dynamodb:Put*',
  'dynamodb:Create*',
  'dynamodb:BatchWriteItem',
  'dynamodb:PartiQLInsert',
  'dynamodb:Get*',
  'dynamodb:BatchGetItem',
  'dynamodb:List*',
  'dynamodb:Describe*',
  'dynamodb:Scan',
  'dynamodb:Query',
  'dynamodb:PartiQLSelect',
  'dynamodb:Update*',
  'dynamodb:RestoreTable*',
  'dynamodb:PartiQLUpdate',
  'dynamodb:Delete*',
  'dynamodb:PartiQLDelete'
);
const s3Bucket = backend.storage.resources.cfnResources.cfnBucket;
// Use this bucket name post refactor
// s3Bucket.bucketName = 'financetrackerfinal991332b91dc649ac85bdb3679d1e40c0c-main';
s3Bucket.bucketEncryption = {
  serverSideEncryptionConfiguration: [
    {
      serverSideEncryptionByDefault: {
        sseAlgorithm: 'AES256',
      },
      bucketKeyEnabled: false,
    },
  ],
};

backend.financetrackerfinal82393814.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['sns:Publish'],
    resources: ['*'],
  })
);
