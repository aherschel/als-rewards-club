#!/usr/bin/env node
import 'source-map-support/register';
import { App }from 'aws-cdk-lib';
import { BackendStack } from './stacks/backend-stack';
import { SecretStack } from './stacks/secret-stack';

const app = new App();

const secretStack = new SecretStack(app, 'TacoAppSecrets', {});

new BackendStack(app, 'TacoAppBackend', {
  githubAuthToken: secretStack.githubAuthToken,
});
