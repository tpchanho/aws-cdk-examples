#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import WsApiCustomRequestAuthOldStack from '../lib/ws-api-custom-request-auth-old-stack';

const app = new cdk.App();
new WsApiCustomRequestAuthOldStack(app, 'WsApiCustomRequestAuthOldStack');
