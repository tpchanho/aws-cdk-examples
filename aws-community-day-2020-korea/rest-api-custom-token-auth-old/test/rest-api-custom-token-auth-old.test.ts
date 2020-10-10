import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import RestApiCustomTokenAuthOldStack from '../lib/rest-api-custom-token-auth-old-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new RestApiCustomTokenAuthOldStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(matchTemplate({
    Resources: {},
  }, MatchStyle.EXACT));
});
