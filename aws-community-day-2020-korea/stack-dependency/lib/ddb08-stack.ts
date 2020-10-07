import * as cdk from "@aws-cdk/core";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";

export class Ddb08Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const Sample05Table = new Table(this, "Sample08Table", {
      partitionKey: {
        name: "Id",
        type: AttributeType.STRING,
      },
      tableName: "Sample08Table",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
