import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib'
import { HostedNextJsApp } from '../constructs/hosted-next-js-app';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';

export type HostingStackProps = StackProps & {
  githubAuthToken: ISecret;
};

export class HostingStack extends Stack {
  constructor(scope: Construct, id: string, props: HostingStackProps) {
    super(scope, id, props);

    new HostedNextJsApp(this, 'HostedApp', {
      githubOwner: 'aherschel',
      repoName: 'als-rewards-club',
      githubAuthToken: props.githubAuthToken,
      branchConfig: {
        main: {
          backendStage: 'PRODUCTION',
          subdomainPrefix: '',
        },
      },
      domainNames: ['alsrewardsclub.com'],
    });
  }
}
