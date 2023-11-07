import fs from 'fs';
import process from 'process';

const { AlsRewardsClubBackend: {
  awsAppsyncRegion: region,
  awsAppsyncApiId: apiId },
} = JSON.parse(fs.readFileSync('output.json'));

const graphqlConfig = `projects:
  Codegen Project:
    schemaPath: schema.json
    includes:
      - codegen/graphql/**/*.ts
    excludes:
      - ./amplify/**
    extensions:
      amplify:
        codeGenTarget: typescript
        generatedFileName: codegen/API.ts
        docsFilePath: codegen/graphql
        region: ${region}
        apiId: ${apiId}
        frontend: javascript
        framework: react
        maxDepth: 2
extensions:
  amplify:
    version: 3`;

fs.writeFileSync('.graphqlconfig.yml', graphqlConfig);
process.exit(0);
