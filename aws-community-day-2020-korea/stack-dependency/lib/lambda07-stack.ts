import * as cdk from "@aws-cdk/core";
import { Function, Runtime, AssetCode } from "@aws-cdk/aws-lambda";
import { Table } from "@aws-cdk/aws-dynamodb";

interface Lambda07StackProp extends cdk.StackProps {
  sampleTable: Table;
}
export class Lambda07Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: Lambda07StackProp) {
    super(scope, id, props);

    const testFunc1 = new Function(this, "Sample07TestFunc1", {
      functionName: "Sample07TestFunc1",
      code: new AssetCode("./lambda-src/test"),
      handler: "test.handler",
      runtime: Runtime.PYTHON_3_8,
      environment: {
        TABLE_NAME: props.sampleTable.tableName,
        PRIMARY_KEY: "Id",
      },
    });
    props.sampleTable.grantReadWriteData(testFunc1);
  }
}
