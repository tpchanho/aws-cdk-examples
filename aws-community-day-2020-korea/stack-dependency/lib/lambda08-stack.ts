import * as cdk from "@aws-cdk/core";
import { Function, Runtime, AssetCode } from "@aws-cdk/aws-lambda";

interface Lambda08StackProp extends cdk.StackProps {
  sampleTableName: string;
}
export class Lambda08Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: Lambda08StackProp) {
    super(scope, id, props);

    const testFunc1 = new Function(this, "Sample08TestFunc1", {
      functionName: "Sample08TestFunc1",
      code: new AssetCode("./lambda-src/test"),
      handler: "test.handler",
      runtime: Runtime.PYTHON_3_8,
      environment: {
        TABLE_NAME: props.sampleTableName,
        PRIMARY_KEY: "Id",
      },
    });
  }
}
