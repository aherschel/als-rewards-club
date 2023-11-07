import { getResourcePath } from './resource';
import * as fs from 'fs';
import * as path from 'path';

export type BedrockResolverConfig = {
  typeName: string;
  fieldName: string;
  codePath: string;
};

const BEDROCK_RESOLVER_DIR = getResourcePath('bedrock-resolvers');

export const listBedrockResolvers = (): Array<BedrockResolverConfig> => fs.readdirSync(BEDROCK_RESOLVER_DIR)
  .filter((fileName) => fileName.endsWith('.js'))
  .map((fileName) => {
    const [typeName, fieldName] = fileName.split('.');
    return { typeName, fieldName, codePath: path.join(BEDROCK_RESOLVER_DIR, fileName) };
  });
