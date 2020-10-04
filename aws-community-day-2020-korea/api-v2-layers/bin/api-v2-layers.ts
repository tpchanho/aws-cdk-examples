#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiV2LayersStack } from '../lib/api-v2-layers-stack';

const app = new cdk.App();
new ApiV2LayersStack(app, 'ApiV2LayersStack');
