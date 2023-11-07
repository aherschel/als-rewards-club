import { Construct } from 'constructs';
import { UserPool, AccountRecovery, VerificationEmailStyle, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { IdentityPool, UserPoolAuthenticationProvider } from '@aws-cdk/aws-cognito-identitypool-alpha';

export class AmplifyAuthResources extends Construct {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;
  public readonly identityPool: IdentityPool;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.userPool = new UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      accountRecovery: AccountRecovery.PHONE_AND_EMAIL,
      userVerification: { emailStyle: VerificationEmailStyle.CODE },
      autoVerify: { email: true },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        }
      },
    });
  
    this.userPoolClient = new UserPoolClient(this, 'UserpoolClient', { userPool: this.userPool });
  
    this.identityPool = new IdentityPool(this, 'IdentityPool', {
      allowUnauthenticatedIdentities: true,
      authenticationProviders: { userPools: [new UserPoolAuthenticationProvider({ userPool: this.userPool, userPoolClient: this.userPoolClient })] },
    });
  }
}
