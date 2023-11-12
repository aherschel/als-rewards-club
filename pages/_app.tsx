import '@/styles/globals.css';
import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import AmplifyConfig from '@/amplifyconfiguration.json';
import type { AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

Amplify.configure({
  API: {
    GraphQL: {
      endpoint: AmplifyConfig.aws_appsync_graphqlEndpoint,
      region: AmplifyConfig.aws_appsync_region,
      apiKey: AmplifyConfig.aws_appsync_apiKey,
      defaultAuthMode: 'userPool',
      modelIntrospection: AmplifyConfig.modelIntrospection as unknown as any,
    },
  },
  Auth: {
    Cognito: {
      userPoolId: AmplifyConfig.aws_user_pools_id,
      userPoolClientId: AmplifyConfig.aws_user_pools_web_client_id,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator.Provider>
      <Component {...pageProps} />
    </Authenticator.Provider>
  );
}
