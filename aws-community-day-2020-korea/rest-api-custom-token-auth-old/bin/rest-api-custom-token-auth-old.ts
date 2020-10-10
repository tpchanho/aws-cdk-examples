#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import RestApiCustomTokenAuthOldStack from '../lib/rest-api-custom-token-auth-old-stack';

const app = new cdk.App();
new RestApiCustomTokenAuthOldStack(app, 'RestApiCustomTokenAuthOldStack');
