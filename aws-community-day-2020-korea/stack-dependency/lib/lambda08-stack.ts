import * as cdk from '@aws-cdk/core';
import { Function, Runtime, AssetCode } from '@aws-cdk/aws-lambda';
import {
  Role, ServicePrincipal, ManagedPolicy, Policy, PolicyStatement,
} from '@aws-cdk/aws-iam';

interface Lambda08StackProp extends cdk.StackProps {
  sampleTableName: string;
}
export default class Lambda08Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: Lambda08StackProp) {
    super(scope, id, props);

    const lambdaRole = new Role(this, 'Sample08FuncRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    lambdaRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
    const lambdaPolicy = new Policy(this, 'Sample08FuncPolicy');
    lambdaPolicy.attachToRole(lambdaRole);
    lambdaPolicy.addStatements(new PolicyStatement({
      resources: [`arn:aws:dynamodb:${this.region}:${this.account}:table/${props.sampleTableName}`],
      actions: [
        'dynamodb:BatchGetItem',
        'dynamodb:GetRecords',
        'dynamodb:GetShardIterator',
        'dynamodb:Query',
        'dynamodb:GetItem',
        'dynamodb:Scan',
        'dynamodb:BatchWriteItem',
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',
      ],
    }));

    new Function(this, 'Sample08TestFunc1', {
      functionName: 'Sample08TestFunc1',
      code: new AssetCode('./lambda-src/test'),
      handler: 'test.handler',
      runtime: Runtime.PYTHON_3_8,
      environment: {
        TABLE_NAME: props.sampleTableName,
        PRIMARY_KEY: 'Id',
      },
      role: lambdaRole,
    });
  }
}
