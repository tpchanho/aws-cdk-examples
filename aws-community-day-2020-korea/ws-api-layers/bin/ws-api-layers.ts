#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import WsApiLayersStack from '../lib/ws-api-layers-stack';

const app = new cdk.App();
new WsApiLayersStack(app, 'WsApiLayersStack');
