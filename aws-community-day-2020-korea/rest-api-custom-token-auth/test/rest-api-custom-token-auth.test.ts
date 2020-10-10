import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import RestApiCustomTokenAuthStack from '../lib/rest-api-custom-token-auth-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new RestApiCustomTokenAuthStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(matchTemplate({
    Resources: {},
  }, MatchStyle.EXACT));
});
