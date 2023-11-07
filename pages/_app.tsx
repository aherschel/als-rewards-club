import '@/styles/globals.css';
import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import BackendConfig from '@/output.json';
import type { AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

Amplify.configure({
  aws_project_region: BackendConfig.AlsRewardsClubBackend.awsAppsyncRegion,
  Auth: {
    region: BackendConfig.AlsRewardsClubBackend.awsAppsyncRegion,
    userPoolId: BackendConfig.AlsRewardsClubBackend.UserPoolId,
    userPoolWebClientId: BackendConfig.AlsRewardsClubBackend.UserPoolClientId,
    identityPoolId: BackendConfig.AlsRewardsClubBackend.IdentityPoolId,
  },
  aws_appsync_graphqlEndpoint: BackendConfig.AlsRewardsClubBackend.awsAppsyncApiEndpoint,
  aws_appsync_region: BackendConfig.AlsRewardsClubBackend.awsAppsyncRegion,
  aws_appsync_authenticationType: BackendConfig.AlsRewardsClubBackend.awsAppsyncAuthenticationType,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator.Provider>
      <Component {...pageProps} />
    </Authenticator.Provider>
  );
}
