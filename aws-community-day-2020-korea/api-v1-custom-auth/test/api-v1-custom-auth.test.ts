import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as ApiV1CustomAuth from '../lib/api-v1-custom-auth-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new ApiV1CustomAuth.ApiV1CustomAuthStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
