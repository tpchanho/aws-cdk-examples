import * as cdk from '@aws-cdk/core';
import {
  RestApi, CfnAuthorizer, LambdaIntegration, AuthorizationType, CfnMethod,
} from '@aws-cdk/aws-apigateway';
import { Function, Runtime, AssetCode } from '@aws-cdk/aws-lambda';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';

export default class RestApiCustomTokenAuthOldStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, 'Sample01Api');

    const authorizerFunc = new Function(this, 'Sample01AuthFunc', {
      functionName: 'Sample01AuthFunc',
      code: new AssetCode('./lambda-src/authorizer'),
      handler: 'authorizer.handler',
      runtime: Runtime.PYTHON_3_8,
    });
    const role = new Role(this, 'Sample01AuthorizerRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });

    authorizerFunc.grantInvoke(role);

    const authorizer = new CfnAuthorizer(this, 'Sample01Authorizer', {
      name: 'Sample01Authorizer',
      restApiId: api.restApiId,
      type: 'TOKEN',
      identitySource: 'method.request.header.Authorization',
      authorizerCredentials: role.roleArn,
      authorizerUri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${authorizerFunc.functionArn}/invocations`,
    });

    const testResource = api.root.addResource('test');

    const testFunc = new Function(this, 'Sample01TestFunc', {
      functionName: 'Sample01TestFunc',
      code: new AssetCode('./lambda-src/test'),
      handler: 'test.handler',
      runtime: Runtime.PYTHON_3_8,
    });

    const testIntegration = new LambdaIntegration(testFunc);
    const testMethod = testResource.addMethod('GET', testIntegration, {
      authorizationType: AuthorizationType.CUSTOM,
    });
    const testMethodResource = testMethod.node.findChild('Resource') as CfnMethod;
    testMethodResource.addPropertyOverride('AuthorizerId', { Ref: authorizer.logicalId });
  }
}
