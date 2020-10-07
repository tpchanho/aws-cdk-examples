import * as cdk from '@aws-cdk/core';
import { RestApi, CfnAuthorizer, LambdaIntegration, AuthorizationType, CfnMethod, RequestAuthorizer, TokenAuthorizer } from '@aws-cdk/aws-apigateway'
import { Function, Runtime, AssetCode } from '@aws-cdk/aws-lambda'
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam'

export class ApiV1CustomAuthStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, 'Sample01Api')

    const authorizerFunc = new Function(this, 'Sample01AuthFunc', {
      functionName: 'Sample01AuthFunc',
      code: new AssetCode('./lambda-src/authorizer'),
      // handler: 'authorizer_rq.handler',
      handler: 'authorizer_tk.handler',
      runtime: Runtime.PYTHON_3_8,
    })

    const role = new Role(this, 'Sample01AuthorizerRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });

    authorizerFunc.grantInvoke(role);
    // const authorizer = new RequestAuthorizer(this, 'Sample01RequestAuthorizer', {
    const authorizer = new TokenAuthorizer(this, 'Sample01TokenAuthorizer', {
      handler: authorizerFunc,
      // identitySources: ['method.request.header.Authorization'],
      identitySource: 'method.request.header.Authorization',
      assumeRole: role,
      // authorizerName: 'Sample01RequestAuthorizer',
      authorizerName: 'Sample01TokenAuthorizer',
    })


    const testResource = api.root.addResource('test');

    const testFunc = new Function(this, 'Sample01TestFunc', {
      functionName: 'Sample01TestFunc',
      code: new AssetCode('./lambda-src/test'),
      handler: 'test.handler',
      runtime: Runtime.PYTHON_3_8
    });

    const testIntegration = new LambdaIntegration(testFunc);
    const testMethod = testResource.addMethod('GET', testIntegration, {
      authorizationType: AuthorizationType.CUSTOM,
      authorizer: authorizer
    })
  }
}
