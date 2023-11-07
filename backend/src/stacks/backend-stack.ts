import { Construct } from 'constructs';
import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import { AmplifyGraphqlApi, AmplifyGraphqlDefinition } from '@aws-amplify/graphql-api-construct';
import { AmplifyAuth } from '@aws-amplify/auth-construct-alpha';

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const auth = new AmplifyAuth(this, 'Auth', {
      loginWith: {
        email: true,
      }
    });
    new CfnOutput(this, 'UserPoolId', { value: auth.resources.userPool.userPoolId });
    new CfnOutput(this, 'UserPoolClientId', { value: auth.resources.userPoolClient.userPoolClientId });
    new CfnOutput(this, 'IdentityPoolId', { value: auth.resources.cfnResources.identityPool.logicalId });

    new AmplifyGraphqlApi(this, 'Api', {
      apiName: 'AlsRewardsClubApi',
      definition: AmplifyGraphqlDefinition.fromString(/* GraphQL */ `
        type Recipe @model @auth(rules: [{ allow: owner }, { allow: public, provider: iam, operations: [read] }]) {
          title: String!
          description: String!
        }
      `),
      authorizationModes: {
        defaultAuthorizationMode: 'AMAZON_COGNITO_USER_POOLS',
        userPoolConfig: { userPool: auth.resources.userPool },
        iamConfig: {
          identityPoolId: auth.resources.cfnResources.identityPool.logicalId,
          authenticatedUserRole: auth.resources.authenticatedUserIamRole,
          unauthenticatedUserRole: auth.resources.unauthenticatedUserIamRole,
        },
      },
    });
  }
}
