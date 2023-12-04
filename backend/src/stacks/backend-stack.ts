import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib'
import { AmplifyGraphqlApi, AmplifyGraphqlDefinition } from '@aws-amplify/graphql-api-construct';
import { AmplifyAuth } from '@aws-amplify/auth-construct-alpha';
import { schema } from '../schema';
import { GraphqlApiMonitoring } from '../constructs/graphql-api-monitoring';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const auth = new AmplifyAuth(this, 'Auth', { loginWith: { email: true } });

    const startJamFn = new NodejsFunction(this, 'StartJamFn', {
      entry: path.join(__dirname, '..', 'functions', 'start-jam.ts'),
      runtime: Runtime.NODEJS_20_X,
      architecture: Architecture.ARM_64,
    });

    const api = new AmplifyGraphqlApi(this, 'Api', {
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
      functionNameMap: {
        StartJam: startJamFn,
      },
    });

    new GraphqlApiMonitoring(this, 'ApiMonitoring', {
      api,
      additionalResources: {
        functions: [
          startJamFn,
        ],
      },
    });
  }
}
