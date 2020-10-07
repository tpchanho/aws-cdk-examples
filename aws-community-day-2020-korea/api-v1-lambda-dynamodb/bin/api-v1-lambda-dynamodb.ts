#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiV1LambdaDynamodbStack } from '../lib/api-v1-lambda-dynamodb-stack';
import { ApiV1LambdaDynamodbStackM1 } from '../lib/api-v1-lambda-dynamodb-stack-m1';
import { ApiV1LambdaDynamodbStackM2 } from '../lib/api-v1-lambda-dynamodb-stack-m2';

const app = new cdk.App();
new ApiV1LambdaDynamodbStack(app, 'ApiV1LambdaDynamodbStack');
new ApiV1LambdaDynamodbStackM1(app, 'ApiV1LambdaDynamodbStackM1');
new ApiV1LambdaDynamodbStackM2(app, 'ApiV1LambdaDynamodbStackM2');
