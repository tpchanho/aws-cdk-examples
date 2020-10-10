import * as cdk from '@aws-cdk/core';
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { Function, Runtime, AssetCode } from '@aws-cdk/aws-lambda';

interface Lambda09StackProp extends cdk.StackProps {
  api: RestApi;
}
export default class Lambda09Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: Lambda09StackProp) {
    super(scope, id, props);

    const testFunc = new Function(this, 'Sample09TestFunc', {
      functionName: 'Sample09TestFunc',
      code: new AssetCode('./lambda-src/test'),
      handler: 'test.handler',
      runtime: Runtime.PYTHON_3_8,
    });

    const testResource = props.api.root.addResource('test09');
    const testIntegration = new LambdaIntegration(testFunc);
    testResource.addMethod('GET', testIntegration);
  }
}
