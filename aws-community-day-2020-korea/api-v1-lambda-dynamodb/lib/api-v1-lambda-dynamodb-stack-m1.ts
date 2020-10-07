import * as cdk from '@aws-cdk/core';
import { RestApi,  LambdaIntegration } from '@aws-cdk/aws-apigateway'
import { Function, Runtime, AssetCode } from '@aws-cdk/aws-lambda'
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam'
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb'

export class ApiV1LambdaDynamodbStackM1 extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const Sample05Table = new Table(this, 'Sample05Table', {
      partitionKey: {
        name: 'Id',
        type: AttributeType.STRING
      },
      tableName: 'Sample05Table',
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const testFunc1 = new Function(this, 'Sample05TestFunc1', {
      functionName: 'Sample05TestFunc1',
      code: new AssetCode('./lambda-src/test'),
      handler: 'test.handler',
      runtime: Runtime.PYTHON_3_8,
      environment: {
        TABLE_NAME: Sample05Table.tableName,
        PRIMARY_KEY: 'Id'
      }
    });
    const testFunc2 = new Function(this, 'Sample05TestFunc2', {
      functionName: 'Sample05TestFunc2',
      code: new AssetCode('./lambda-src/test'),
      handler: 'test.handler',
      runtime: Runtime.PYTHON_3_8,
      environment: {
        TABLE_NAME: Sample05Table.tableName,
        PRIMARY_KEY: 'Id'
      }
    });
    const testFunc3 = new Function(this, 'Sample05TestFunc3', {
      functionName: 'Sample05TestFunc3',
      code: new AssetCode('./lambda-src/test'),
      handler: 'test.handler',
      runtime: Runtime.PYTHON_3_8,
      environment: {
        TABLE_NAME: Sample05Table.tableName,
        PRIMARY_KEY: 'Id'
      }
    });
    Sample05Table.grantReadWriteData(testFunc1);
    Sample05Table.grantReadWriteData(testFunc2);
    Sample05Table.grantReadWriteData(testFunc3);
    

    const api = new RestApi(this, 'Sample05Api')
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
