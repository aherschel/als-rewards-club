import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib'
import { AmplifyGraphqlApi, AmplifyGraphqlDefinition } from '@aws-amplify/graphql-api-construct';
import { AmplifyAuth } from '@aws-amplify/auth-construct-alpha';
import { schema } from '../schema';

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const auth = new AmplifyAuth(this, 'Auth', { loginWith: { email: true } });

    new AmplifyGraphqlApi(this, 'Api', {
      apiName: 'AlsRewardsClubApi',
      definition: AmplifyGraphqlDefinition.fromString(schema.transform().schema),
      authorizationModes: {
        defaultAuthorizationMode: 'AWS_IAM',
        userPoolConfig: { userPool: auth.resources.userPool },
        iamConfig: {
          identityPoolId: auth.resources.cfnResources.cfnIdentityPool.ref,
          authenticatedUserRole: auth.resources.authenticatedUserIamRole,
          unauthenticatedUserRole: auth.resources.unauthenticatedUserIamRole,
        },
      },
    });
  }
}
