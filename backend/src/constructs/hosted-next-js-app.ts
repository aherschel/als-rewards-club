import { Construct } from 'constructs';
import { Stack, Duration } from 'aws-cdk-lib'
import { PolicyStatement, Effect, PolicyDocument, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { App, Branch, GitHubSourceCodeProvider, Platform, RedirectStatus } from '@aws-cdk/aws-amplify-alpha';
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild'
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';

export type HostedNextJsAppBranchConfig = {
  backendStage: string;
  subdomainPrefix: string;
};

export type HostedNextJsAppProps = {
  githubOwner: string;
  repoName: string;
  githubAuthToken: ISecret;
  branchConfig: Record<string, HostedNextJsAppBranchConfig>
  domainNames?: string[];
};

export class HostedNextJsApp extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { githubOwner, repoName, githubAuthToken, branchConfig, domainNames }: HostedNextJsAppProps,
  ) {
    super(scope, id);

    const amplifyDeployCDKRole = new Role(this, 'allow-amplify-deploy-cdk-role', {
      assumedBy: new ServicePrincipal('amplify.amazonaws.com'),
      description: 'Role assumed by Amplify Hosting for deploying aws cdk',
      maxSessionDuration: Duration.hours(1),
      inlinePolicies: {
        CdkDeploymentPolicy: new PolicyDocument({
          assignSids: true,
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['sts:AssumeRole'],
              resources: [`arn:aws:iam::${Stack.of(this).account}:role/cdk-*`],
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              // Todo: Use API to get Arns for specific permissions here.
              actions: [
                'appsync:GetIntrospectionSchema',
                'appsync:GetGraphqlApi',
              ],
              resources: ['*'],
            }),
          ],
        }),
      },
    });

    const app = new App(this, 'HostedApp', {
      role: amplifyDeployCDKRole,
      sourceCodeProvider: new GitHubSourceCodeProvider({
        owner: githubOwner,
        repository: repoName,
        oauthToken: githubAuthToken.secretValue,
      }),
      platform: Platform.WEB_COMPUTE,
      autoBranchDeletion: true,
      customRules: [
        {
          source: '/<*>',
          target: '/index.html',
          status: RedirectStatus.NOT_FOUND_REWRITE,
        },
      ],
      environmentVariables: {
        myAmplifyEnv: 'test', //process.env.myAmplifyEnv on frontend
      },
      buildSpec: BuildSpec.fromObject({
        version: 1,
        frontend: {
          phases: {
            preBuild: {
              commands: [
                'cd backend',
                'npm ci',
                'npm run deploy:ci',
                'cd ..',
                'npm ci',
                'npm run codegen',
              ],
            },
            build: {
              commands: [
                'npm run build',
              ],
            },
          },
          artifacts: {
            baseDirectory: '.next',
            files: [
              '**/*',
            ],
          },
          cache: {
            paths: [
              'node_modules/**/*',
            ],
          },
        },
      }),
    });

    Object.entries(branchConfig).forEach(([branchName, { backendStage }]) => {
      app.addBranch(branchName, { stage: backendStage });
    });

    if (domainNames) {
      domainNames.forEach((domainName: string) => {
        const domain = app.addDomain(`${domainName}Domain`, { domainName });
        Object.entries(branchConfig).forEach(([branchName, { subdomainPrefix }]) => {
          domain.mapSubDomain(Branch.fromBranchName(this, `${domainName}${branchName}Branch`, branchName), subdomainPrefix);
        });
      });
    }
  }
}
