#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiV2CustomAuthStack } from '../lib/api-v2-custom-auth-stack';

const app = new cdk.App();
new ApiV2CustomAuthStack(app, 'ApiV2CustomAuthStack');
