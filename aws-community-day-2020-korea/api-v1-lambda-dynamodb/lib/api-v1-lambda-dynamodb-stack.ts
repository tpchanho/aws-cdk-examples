import * as cdk from '@aws-cdk/core';
import { RestApi, CfnAuthorizer, LambdaIntegration, AuthorizationType, CfnMethod } from '@aws-cdk/aws-apigateway'
import { Function, Runtime, AssetCode } from '@aws-cdk/aws-lambda'
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam'
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb'

export class ApiV1LambdaDynamodbStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sample04Table = new Table(this, 'Sample04Table', {
      partitionKey: {
        name: 'Id',
        type: AttributeType.STRING
      },
      tableName: 'Sample04Table',
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const testFunc = new Function(this, 'Sample04TestFunc', {
      functionName: 'Sample04TestFunc',
      code: new AssetCode('./lambda-src/test'),
      handler: 'test.handler',
      runtime: Runtime.PYTHON_3_8,
      environment: {
        TABLE_NAME: sample04Table.tableName,
        PRIMARY_KEY: 'Id'
      }
    });

    sample04Table.grantReadWriteData(testFunc)

    const api = new RestApi(this, 'Sample01Api')
    const testResource = api.root.addResource('test');
    const testIntegration = new LambdaIntegration(testFunc);
    const testMethod = testResource.addMethod('GET', testIntegration);
  }
}
