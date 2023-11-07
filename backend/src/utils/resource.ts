import * as path from 'path';

export const getResourcePath = (resourcePath: string): string => path.join(__dirname, '..', '..', 'resources', resourcePath);
