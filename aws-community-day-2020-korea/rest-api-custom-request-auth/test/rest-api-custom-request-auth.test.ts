import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import RestApiCustomRequestAuthStack from '../lib/rest-api-custom-request-auth-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new RestApiCustomRequestAuthStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(matchTemplate({
    Resources: {},
  }, MatchStyle.EXACT));
});
