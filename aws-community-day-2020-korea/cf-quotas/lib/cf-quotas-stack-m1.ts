import * as cdk from '@aws-cdk/core';
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { Function, Runtime, AssetCode } from '@aws-cdk/aws-lambda';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';

export default class CfQuotasStackM1 extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const Sample05Table = new Table(this, 'Sample05Table', {
      partitionKey: {
        name: 'Id',
        type: AttributeType.STRING,
      },
      tableName: 'Sample05Table',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const api = new RestApi(this, 'Sample05Api');

    for (let i = 1; i <= 27; i += 1) {
      const testFunc = new Function(this, `Sample05TestFunc${i}`, {
        functionName: `Sample05TestFunc${i}`,
        code: new AssetCode('./lambda-src/test'),
        handler: 'test.handler',
        runtime: Runtime.PYTHON_3_8,
        environment: {
          TABLE_NAME: Sample05Table.tableName,
          PRIMARY_KEY: 'Id',
        },
      });
      Sample05Table.grantReadWriteData(testFunc);
      const testIntegration = new LambdaIntegration(testFunc);
      const testResource = api.root.addResource(`test1${i}`);
      testResource.addMethod('GET', testIntegration);
    }
  }
}
