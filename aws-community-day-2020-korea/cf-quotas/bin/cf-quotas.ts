#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import CfQuotasStack from '../lib/cf-quotas-stack';
import CfQuotasStackM1 from '../lib/cf-quotas-stack-m1';
import CfQuotasStackM2 from '../lib/cf-quotas-stack-m2';

const app = new cdk.App();
new CfQuotasStack(app, 'CfQuotasStack');
new CfQuotasStackM1(app, 'CfQuotasStackM1');
new CfQuotasStackM2(app, 'CfQuotasStackM2');
