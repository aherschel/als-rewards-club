import { Construct } from 'constructs';
import { Stack } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AmplifyGraphqlApi, AmplifyGraphqlDefinition } from '@aws-amplify/graphql-api-construct';
import { Code, FunctionRuntime } from 'aws-cdk-lib/aws-appsync';
import { getResourcePath } from '../utils/resource';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { IdentityPool } from '@aws-cdk/aws-cognito-identitypool-alpha';
import { listBedrockResolvers } from '../utils/resolvers';

export type BedrockEnabledApiProps = {
  userPool: UserPool;
  identityPool: IdentityPool;
  enabledBedrockModelIds: string[]
};

export class BedrockEnabledApi extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { userPool, identityPool, enabledBedrockModelIds }: BedrockEnabledApiProps,
  ) {
    super(scope, id);

    const api = new AmplifyGraphqlApi(this, 'BedrockEnabledApi', {
      definition: AmplifyGraphqlDefinition.fromFiles(getResourcePath('schema.graphql')),
      authorizationModes: {
        defaultAuthorizationMode: 'AMAZON_COGNITO_USER_POOLS',
        userPoolConfig: { userPool },
        iamConfig: {
          identityPoolId: identityPool.identityPoolId,
          authenticatedUserRole: identityPool.authenticatedRole,
          unauthenticatedUserRole: identityPool.unauthenticatedRole,
        },
      },
    });
  
    const region = Stack.of(this).region;

    const bedrockDataSource = api.addHttpDataSource('BedrockHTTPkDataSource', `https://bedrock-runtime.${region}.amazonaws.com`, {
      authorizationConfig: {
        signingRegion: region,
        signingServiceName: 'bedrock',
      },
    });

    bedrockDataSource.grantPrincipal.addToPrincipalPolicy(new PolicyStatement({
      resources: enabledBedrockModelIds.map((modelId: string) => `arn:aws:bedrock:${region}::foundation-model/${modelId}`),
      actions: ['bedrock:InvokeModel'],
    }));

    listBedrockResolvers().forEach(({ typeName, fieldName, codePath }) => {
      api.addResolver(`${typeName}${fieldName}`, {
        typeName,
        fieldName,
        dataSource: bedrockDataSource,
        code: Code.fromAsset(codePath),
        runtime: FunctionRuntime.JS_1_0_0,
      });
    });
  }
}
