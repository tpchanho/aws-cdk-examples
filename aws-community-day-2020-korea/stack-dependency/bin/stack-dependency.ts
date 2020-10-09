#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";

import { Lambda07Stack } from "../lib/lambda07-stack";
import { Ddb07Stack } from "../lib/ddb07-stack";

import { Lambda08Stack } from "../lib/lambda08-stack";
import { Ddb08Stack } from "../lib/ddb08-stack";

import { Api09Stack } from "../lib/api09-stack";
import { Lambda09Stack } from "../lib/lambda09-stack";
import { Lambda10Stack } from "../lib/lambda10-stack";

const app = new cdk.App();
const ddb07Stack = new Ddb07Stack(app, "Ddb07Stack");
new Lambda07Stack(app, "Lambda07Stack", {
  sampleTable: ddb07Stack.sampleTable,
});

const sampleTableName = "Sample08Table";
new Ddb08Stack(app, "Ddb08Stack", {
  sampleTableName
});
new Lambda08Stack(app, "Lambda08Stack", {
  sampleTableName,
});

const api09Stack = new Api09Stack(app, "Api09Stack");
new Lambda09Stack(app, "Lambda09Stack", {
  api: api09Stack.api,
});
new Lambda10Stack(app, "Lambda10Stack", {
  api: api09Stack.api,
});
