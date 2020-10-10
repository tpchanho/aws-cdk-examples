import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import StackDependencyStack from '../lib/stack-dependency-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new StackDependencyStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(matchTemplate({
    Resources: {},
  }, MatchStyle.EXACT));
});
