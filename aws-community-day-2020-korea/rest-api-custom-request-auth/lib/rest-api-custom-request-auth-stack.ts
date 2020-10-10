import * as cdk from '@aws-cdk/core';
import {
  RestApi, LambdaIntegration, AuthorizationType, RequestAuthorizer,
} from '@aws-cdk/aws-apigateway';
import { Function, Runtime, AssetCode } from '@aws-cdk/aws-lambda';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';

export default class RestApiCustomRequestAuthStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, 'Sample01Api');

    const authorizerFunc = new Function(this, 'Sample01AuthFunc', {
      functionName: 'Sample01AuthFunc',
      code: new AssetCode('./lambda-src/authorizer'),
      handler: 'authorizer_rq.handler',
      runtime: Runtime.PYTHON_3_8,
    });

    const role = new Role(this, 'Sample01AuthorizerRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });

    authorizerFunc.grantInvoke(role);
    const authorizer = new RequestAuthorizer(this, 'Sample01RequestAuthorizer', {

      handler: authorizerFunc,
      identitySources: ['method.request.header.Authorization'],

      assumeRole: role,
      authorizerName: 'Sample01RequestAuthorizer',
    });

    const testResource = api.root.addResource('test');

    const testFunc = new Function(this, 'Sample01TestFunc', {
      functionName: 'Sample01TestFunc',
      code: new AssetCode('./lambda-src/test'),
      handler: 'test.handler',
      runtime: Runtime.PYTHON_3_8,
    });

    const testIntegration = new LambdaIntegration(testFunc);
    testResource.addMethod('GET', testIntegration, {
      authorizationType: AuthorizationType.CUSTOM,
      authorizer,
    });
  }
}
