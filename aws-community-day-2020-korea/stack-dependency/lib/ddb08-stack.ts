import * as cdk from "@aws-cdk/core";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";

interface Ddb08StackProps extends cdk.StackProps {
  sampleTableName: string;
}
export class Ddb08Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: Ddb08StackProps) {
    super(scope, id, props);

    const Sample05Table = new Table(this, "Sample08Table", {
      partitionKey: {
        name: "Id",
        type: AttributeType.STRING,
      },
      tableName: props.sampleTableName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
