import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib'
import { Secret, ISecret } from 'aws-cdk-lib/aws-secretsmanager'

export class SecretStack extends Stack {
  public readonly githubAuthToken: ISecret;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.githubAuthToken = new Secret(this, 'GithubAuthToken');
  }
}
