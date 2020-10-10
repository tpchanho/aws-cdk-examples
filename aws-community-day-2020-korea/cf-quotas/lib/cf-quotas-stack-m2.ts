import * as cdk from '@aws-cdk/core';
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { Function, Runtime, AssetCode } from '@aws-cdk/aws-lambda';
import {
  Role, ServicePrincipal, Policy, PolicyStatement, ManagedPolicy,
} from '@aws-cdk/aws-iam';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';

export default class CfQuotasStackM2 extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const Sample06Table = new Table(this, 'Sample06Table', {
      partitionKey: {
        name: 'Id',
        type: AttributeType.STRING,
      },
      tableName: 'Sample06Table',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const lambdaRole = new Role(this, 'Sample06FuncRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    lambdaRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));

    const lambdaPolicy = new Policy(this, 'Sample06FuncPolicy');
    lambdaPolicy.attachToRole(lambdaRole);
    lambdaPolicy.addStatements(new PolicyStatement({
      resources: [`arn:aws:dynamodb:${this.region}:${this.account}:table/${Sample06Table.tableName}`],
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

    const api = new RestApi(this, 'Sample06Api');

    for (let i = 1; i <= 38; i += 1) {
      const testFunc = new Function(this, `Sample06TestFunc${i}`, {
        functionName: `Sample06TestFunc${i}`,
        code: new AssetCode('./lambda-src/test'),
        handler: 'test.handler',
        runtime: Runtime.PYTHON_3_8,
        environment: {
          TABLE_NAME: Sample06Table.tableName,
          PRIMARY_KEY: 'Id',
        },
        role: lambdaRole,
      });
      Sample06Table.grantReadWriteData(testFunc);
      const testIntegration = new LambdaIntegration(testFunc);
      const testResource = api.root.addResource(`test1${i}`);
      testResource.addMethod('GET', testIntegration);
    }
  }
}
