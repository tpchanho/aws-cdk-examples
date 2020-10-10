#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import RestApiCustomRequestAuthStack from '../lib/rest-api-custom-request-auth-stack';

const app = new cdk.App();
new RestApiCustomRequestAuthStack(app, 'RestApiCustomRequestAuthStack');
