import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib'
import { HostedNextJsApp } from '../constructs/hosted-next-js-app';
import { BedrockEnabledApi } from '../constructs/bedrock-enabled-api';
import { AmplifyCodegenOutputs } from '../constructs/amplify-codegen-outputs';
import { AmplifyAuthResources } from '../constructs/amplify-auth-resources';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';

export type BackendStackProps = StackProps & {
  githubAuthToken: ISecret;
};

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const auth = new AmplifyAuthResources(this, 'Auth');

    new BedrockEnabledApi(this, 'Api', {
      userPool: auth.userPool,
      identityPool: auth.identityPool,
      enabledBedrockModelIds: ['cohere.command-text-v14'],
    });

    new HostedNextJsApp(this, 'HostedApp', {
      githubOwner: 'aherschel',
      repoName: 'PhoenixBuild',
      githubAuthToken: props.githubAuthToken,
      branchConfig: {
        main: {
          backendStage: 'PRODUCTION',
          subdomainPrefix: '',
        },
      },
      domainNames: ['cookiescookies.net'],
    });

    new AmplifyCodegenOutputs(this, 'Outputs', {
      userPool: auth.userPool,
      userPoolClient: auth.userPoolClient,
      identityPool: auth.identityPool,
    });
  }
}
