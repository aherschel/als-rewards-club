#!/usr/bin/env node
import 'source-map-support/register';
import { App, Environment }from 'aws-cdk-lib';
import { BackendStack } from './stacks/backend-stack';
import { SecretStack } from './stacks/secret-stack';
import { HostingStack } from './stacks/hosting-stack';

const env: Environment = { region: 'us-west-2' };

const app = new App();

const secretStack = new SecretStack(app, 'AlsRewardsClubSecrets', { env });
new BackendStack(app, 'AlsRewardsClubBackend', { env });
new HostingStack(app, 'AlsRewardsClubHosting', {
  env,
  githubAuthToken: secretStack.githubAuthToken,
});
