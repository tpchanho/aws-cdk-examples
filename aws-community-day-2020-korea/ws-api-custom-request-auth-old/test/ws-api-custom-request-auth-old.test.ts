import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import WsApiCustomRequestAuthOldStack from '../lib/ws-api-custom-request-auth-old-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new WsApiCustomRequestAuthOldStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(matchTemplate({
    Resources: {},
  }, MatchStyle.EXACT));
});
