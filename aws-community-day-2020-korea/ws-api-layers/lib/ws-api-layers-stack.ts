import * as cdk from '@aws-cdk/core';
import { AuthorizationType } from '@aws-cdk/aws-apigateway';
import {
  CfnApi, CfnAuthorizer, CfnIntegration, CfnRoute, CfnDeployment, CfnStage,
} from '@aws-cdk/aws-apigatewayv2';
import {
  Function as LambdaFunc, Runtime, AssetCode, LayerVersion,
} from '@aws-cdk/aws-lambda';
import { Role, ServicePrincipal, ManagedPolicy } from '@aws-cdk/aws-iam';

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
export default class WsApiLayersStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const api = new CfnApi(this, 'Sample03Api', {
      name: 'Sample03Api',
      protocolType: 'WEBSOCKET',
      routeSelectionExpression: '$request.body.Action',
    });

    const authorizerFunc = new LambdaFunc(this, 'Sample03AuthFunc', {
      functionName: 'Sample03AuthFunc',
      code: new AssetCode('./lambda-src/authorizer'),
      handler: 'authorizer.handler',
      runtime: Runtime.PYTHON_3_8,
    });
    const role = new Role(this, 'Sample03AuthorizerRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });

    authorizerFunc.grantInvoke(role);

    const authorizer = new CfnAuthorizer(this, 'Sample03Authorizer', {
      name: 'Sample03Authorizer',
      apiId: api.ref,
      authorizerType: 'REQUEST',
      identitySource: ['route.request.header.Authorization'],
      authorizerCredentialsArn: role.roleArn,
      authorizerUri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${authorizerFunc.functionArn}/invocations`,
    });

    const sampleLayer = new LayerVersion(this, 'Sample03Layers', {
      code: new AssetCode('./layers/sample03'),
      compatibleRuntimes: [Runtime.PYTHON_3_8],
    });

    const lambdaRole = new Role(this, 'Sample03LambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    lambdaRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
    lambdaRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonAPIGatewayInvokeFullAccess'));

    const connectFunc = new LambdaFunc(this, 'Sample03ConnectFunc', {
      functionName: 'Sample03ConnectFunc',
      code: new AssetCode('./lambda-src/connect'),
      handler: 'connect.handler',
      runtime: Runtime.PYTHON_3_8,
      layers: [sampleLayer],
    });
    const disconnectFunc = new LambdaFunc(this, 'Sample03DisconnectFunc', {
      functionName: 'Sample03DisconnectFunc',
      code: new AssetCode('./lambda-src/disconnect'),
      handler: 'disconnect.handler',
      runtime: Runtime.PYTHON_3_8,
      layers: [sampleLayer],
    });
    const defaultFunc = new LambdaFunc(this, 'Sample03DefaultFunc', {
      functionName: 'Sample03DefaultFunc',
      code: new AssetCode('./lambda-src/default'),
      handler: 'default.handler',
      runtime: Runtime.PYTHON_3_8,
      layers: [sampleLayer],
    });
    const testFunc = new LambdaFunc(this, 'Sample03TestFunc', {
      functionName: 'Sample03TestFunc',
      code: new AssetCode('./lambda-src/test'),
      handler: 'test.handler',
      runtime: Runtime.PYTHON_3_8,
      layers: [sampleLayer],
      role: lambdaRole,
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

    const deployment = new CfnDeployment(this, `Sample03Deployment${new Date().getTime()}`, {
      apiId: api.ref,
    });
    deployment.addDependsOn(testRoute);
    new CfnStage(this, 'Sample03Stage', {
      apiId: api.ref,
      deploymentId: deployment.ref,
      stageName: 'prod',
    });
  }
}
