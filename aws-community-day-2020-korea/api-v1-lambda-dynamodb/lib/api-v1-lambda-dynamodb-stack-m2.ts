import * as cdk from '@aws-cdk/core';
import { RestApi,  LambdaIntegration } from '@aws-cdk/aws-apigateway'
import { Function, Runtime, AssetCode } from '@aws-cdk/aws-lambda'
import { Role, ServicePrincipal, Policy, PolicyStatement, ManagedPolicy } from '@aws-cdk/aws-iam'
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb'

export class ApiV1LambdaDynamodbStackM2 extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const Sample06Table = new Table(this, 'Sample06Table', {
      partitionKey: {
        name: 'Id',
        type: AttributeType.STRING
      },
      tableName: 'Sample06Table',
      removalPolicy: cdk.RemovalPolicy.DESTROY
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
        "dynamodb:BatchGetItem",
        "dynamodb:GetRecords",
        "dynamodb:GetShardIterator",
        "dynamodb:Query",
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:BatchWriteItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem"
      ]
    }));
    
    const testFunc1 = new Function(this, 'Sample06TestFunc1', {
      functionName: 'Sample06TestFunc1',
      code: new AssetCode('./lambda-src/test'),
      handler: 'test.handler',
      runtime: Runtime.PYTHON_3_8,
      environment: {
        TABLE_NAME: Sample06Table.tableName,
        PRIMARY_KEY: 'Id'
      },
      role: lambdaRole
    });
    const testFunc2 = new Function(this, 'Sample06TestFunc2', {
      functionName: 'Sample06TestFunc2',
      code: new AssetCode('./lambda-src/test'),
      handler: 'test.handler',
      runtime: Runtime.PYTHON_3_8,
      environment: {
        TABLE_NAME: Sample06Table.tableName,
        PRIMARY_KEY: 'Id'
      },
      role: lambdaRole
    });
    const testFunc3 = new Function(this, 'Sample06TestFunc3', {
      functionName: 'Sample06TestFunc3',
      code: new AssetCode('./lambda-src/test'),
      handler: 'test.handler',
      runtime: Runtime.PYTHON_3_8,
      environment: {
        TABLE_NAME: Sample06Table.tableName,
        PRIMARY_KEY: 'Id'
      },
      role: lambdaRole
    });

    const api = new RestApi(this, 'Sample06Api')
    const testResource1 = api.root.addResource('test1');
    const testIntegration1 = new LambdaIntegration(testFunc1);
    const testMethod1 = testResource1.addMethod('GET', testIntegration1);
    const testResource2 = api.root.addResource('test2');
    const testIntegration2 = new LambdaIntegration(testFunc2);
    const testMethod2 = testResource2.addMethod('GET', testIntegration2);
    const testResource3 = api.root.addResource('test3');
    const testIntegration3 = new LambdaIntegration(testFunc3);
    const testMethod3 = testResource3.addMethod('GET', testIntegration3);
  }
}
