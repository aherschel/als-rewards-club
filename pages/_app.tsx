import '@/styles/globals.css';
import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import cdkOutputs from '@/output.json';
import type { AppProps } from 'next/app';

Amplify.configure({
  aws_project_region: cdkOutputs.BackendStack.awsAppsyncRegion,
  Auth: {
    region: cdkOutputs.BackendStack.awsAppsyncRegion,
    userPoolId: cdkOutputs.BackendStack.UserPoolId,
    userPoolWebClientId: cdkOutputs.BackendStack.UserPoolClientId,
    identityPoolId: cdkOutputs.BackendStack.IdentityPoolId,
  },
  aws_appsync_graphqlEndpoint: cdkOutputs.BackendStack.awsAppsyncApiEndpoint,
  aws_appsync_region: cdkOutputs.BackendStack.awsAppsyncRegion,
  aws_appsync_authenticationType: cdkOutputs.BackendStack.awsAppsyncAuthenticationType,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator.Provider>
      <Component {...pageProps} />
    </Authenticator.Provider>
  );
}
