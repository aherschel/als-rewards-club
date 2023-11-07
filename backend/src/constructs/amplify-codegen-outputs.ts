import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib'
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { IdentityPool } from '@aws-cdk/aws-cognito-identitypool-alpha';

export type AmplifyCodegenOutputsProps = {
  userPool: UserPool;
  userPoolClient: UserPoolClient;
  identityPool: IdentityPool;
};

export class AmplifyCodegenOutputs extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { userPool, userPoolClient, identityPool }: AmplifyCodegenOutputsProps,
  ) {
    super(scope, id);
    new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new CfnOutput(this, 'IdentityPoolId', { value: identityPool.identityPoolId });
  }
}
