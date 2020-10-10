import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import WsApiLayersStack from '../lib/ws-api-layers-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new WsApiLayersStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(matchTemplate({
    Resources: {},
  }, MatchStyle.EXACT));
});
