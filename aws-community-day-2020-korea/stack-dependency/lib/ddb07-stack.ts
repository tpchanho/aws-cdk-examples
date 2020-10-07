import * as cdk from "@aws-cdk/core";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";

export class Ddb07Stack extends cdk.Stack {
  public readonly sampleTable: Table;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.sampleTable = new Table(this, "Sample07Table", {
      partitionKey: {
        name: "Id",
        type: AttributeType.STRING,
      },
      tableName: "Sample07Table",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
