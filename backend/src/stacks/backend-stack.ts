import { Construct } from 'constructs';
import { Duration, Stack, StackProps } from 'aws-cdk-lib'
import { AmplifyGraphqlApi, AuthorizationModes } from '@aws-amplify/graphql-api-construct';
import { AmplifyAuth } from '@aws-amplify/auth-construct-alpha';
import { schema } from '../schema';

const authorizationModesFromAuth = (auth: AmplifyAuth): AuthorizationModes => ({
  defaultAuthorizationMode: 'AMAZON_COGNITO_USER_POOLS',
  userPoolConfig: { userPool: auth.resources.userPool },
  iamConfig: {
    identityPoolId: auth.resources.cfnResources.identityPool.ref,
    authenticatedUserRole: auth.resources.authenticatedUserIamRole,
    unauthenticatedUserRole: auth.resources.unauthenticatedUserIamRole,
  },
});

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const auth = new AmplifyAuth(this, 'Auth', { loginWith: { email: true } });
    new AmplifyGraphqlApi(this, 'Api', {
      apiName: 'AlsRewardsClubApi',
      definition: schema.transform(),
      authorizationModes: {
        ...authorizationModesFromAuth(auth),
        apiKeyConfig: {
          expires: Duration.days(365),
        }
      },
    });
  }
}
