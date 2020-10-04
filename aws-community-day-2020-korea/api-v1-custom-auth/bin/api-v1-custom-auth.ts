#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiV1CustomAuthStack } from '../lib/api-v1-custom-auth-stack';

const app = new cdk.App();
new ApiV1CustomAuthStack(app, 'ApiV1CustomAuthStack');
