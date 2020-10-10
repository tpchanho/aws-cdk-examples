import * as cdk from '@aws-cdk/core';
import { AuthorizationType } from '@aws-cdk/aws-apigateway';
import {
  CfnApi, CfnAuthorizer, CfnRoute, CfnIntegration, CfnDeployment, CfnStage,
} from '@aws-cdk/aws-apigatewayv2';
import { Function as LambdaFunc, Runtime, AssetCode } from '@aws-cdk/aws-lambda';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';

interface NewRouteOptions {
  scope: cdk.Stack;
  region: string;
  account: string;
  api: CfnApi;
  routeName: string;
  lambdaFunc: LambdaFunc;
  authorizer?: CfnAuthorizer;
}

function createRoute(newRouteOptions: NewRouteOptions): CfnRoute {
  const {
    scope, region, account, api, routeName, lambdaFunc: lambdaFn, authorizer,
  } = newRouteOptions;
  let authorizerId;
  let authorizationType;
  if (authorizer) {
    authorizerId = authorizer.ref;
    authorizationType = AuthorizationType.CUSTOM;
  }
  const apiArn = `arn:aws:execute-api:${region}:${account}:${api.ref}/*`;
  const sourceArn = `${apiArn}/${routeName}`;
  lambdaFn.addPermission(`${routeName}InvokeLambdaPermission`, {
    principal: new ServicePrincipal('apigateway.amazonaws.com'),
    action: 'lambda:InvokeFunction',
    sourceArn,
  });
  const integrationUri = `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambdaFn.functionArn}/invocations`;
  const integration1 = new CfnIntegration(scope, `${routeName}Integration`, {
    apiId: api.ref,
    integrationType: 'AWS_PROXY',
    integrationUri,
  });
  const route = new CfnRoute(scope, routeName, {
    apiId: api.ref,
    routeKey: routeName,
    authorizationType,
    authorizerId,
    target: `integrations/${integration1.ref}`,
  });
  return route;
}

export default class WsApiCustomRequestAuthOldStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new CfnApi(this, 'Sample02Api', {
      name: 'Sample02Api',
      protocolType: 'WEBSOCKET',
      routeSelectionExpression: '$request.body.Action',
    });

    const authorizerFunc = new LambdaFunc(this, 'Sample02AuthFunc', {
      functionName: 'Sample02AuthFunc',
      code: new AssetCode('./lambda-src/authorizer'),
      handler: 'authorizer.handler',
      runtime: Runtime.PYTHON_3_8,
    });
    const role = new Role(this, 'Sample02AuthorizerRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });

    authorizerFunc.grantInvoke(role);

    const authorizer = new CfnAuthorizer(this, 'Sample02Authorizer', {
      name: 'Sample02Authorizer',
      apiId: api.ref,
      authorizerType: 'REQUEST',
      identitySource: ['route.request.header.Authorization'],
      authorizerCredentialsArn: role.roleArn,
      authorizerUri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${authorizerFunc.functionArn}/invocations`,
    });

    const connectFunc = new LambdaFunc(this, 'Sample02ConnectFunc', {
      functionName: 'Sample02ConnectFunc',
      code: new AssetCode('./lambda-src/connect'),
      handler: 'connect.handler',
      runtime: Runtime.PYTHON_3_8,
    });
    const disconnectFunc = new LambdaFunc(this, 'Sample02DisconnectFunc', {
      functionName: 'Sample02DisconnectFunc',
      code: new AssetCode('./lambda-src/disconnect'),
      handler: 'disconnect.handler',
      runtime: Runtime.PYTHON_3_8,
    });
    const defaultFunc = new LambdaFunc(this, 'Sample02DefaultFunc', {
      functionName: 'Sample02DefaultFunc',
      code: new AssetCode('./lambda-src/default'),
      handler: 'default.handler',
      runtime: Runtime.PYTHON_3_8,
    });
    const testFunc = new LambdaFunc(this, 'Sample02TestFunc', {
      functionName: 'Sample02TestFunc',
      code: new AssetCode('./lambda-src/test'),
      handler: 'test.handler',
      runtime: Runtime.PYTHON_3_8,
    });

    const { region, account } = this;

    createRoute({
      scope: this, region, account, api, routeName: '$connect', lambdaFunc: connectFunc, authorizer,
    });
    createRoute({
      scope: this, region, account, api, routeName: '$disconnect', lambdaFunc: disconnectFunc,
    });
    createRoute({
      scope: this, region, account, api, routeName: '$default', lambdaFunc: defaultFunc,
    });
    const testRoute = createRoute({
      scope: this, region, account, api, routeName: 'test', lambdaFunc: testFunc,
    });

    const deployment = new CfnDeployment(this, `Sample02Deployment${new Date().getTime()}`, {
      apiId: api.ref,
    });
    deployment.addDependsOn(testRoute);
    new CfnStage(this, 'Sample02Stage', {
      apiId: api.ref,
      deploymentId: deployment.ref,
      stageName: 'prod',
    });
  }
}
