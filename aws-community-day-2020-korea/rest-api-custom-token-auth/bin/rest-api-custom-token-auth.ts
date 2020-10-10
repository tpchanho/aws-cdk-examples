#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import RestApiCustomTokenAuthStack from '../lib/rest-api-custom-token-auth-stack';

const app = new cdk.App();
new RestApiCustomTokenAuthStack(app, 'RestApiCustomTokenAuthStack');
