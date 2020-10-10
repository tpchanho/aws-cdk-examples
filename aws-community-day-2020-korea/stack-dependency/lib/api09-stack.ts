import * as cdk from '@aws-cdk/core';
import { RestApi } from '@aws-cdk/aws-apigateway';

export default class Api09Stack extends cdk.Stack {
  public readonly api: RestApi;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, 'Sample09Api');
    this.api = api;
  }
}
