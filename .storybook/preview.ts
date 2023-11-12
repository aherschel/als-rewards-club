import type { Preview } from "@storybook/react";

import '../styles/globals.css';
import '@aws-amplify/ui-react/styles.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Amplify } from 'aws-amplify';
import AmplifyConfig from '../amplifyconfiguration.json';
import { config } from '@fortawesome/fontawesome-svg-core';

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

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
