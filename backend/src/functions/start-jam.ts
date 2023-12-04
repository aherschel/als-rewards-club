import type { AppSyncResolverEvent } from 'aws-lambda';
import type { StartJamArguments, StartJamResponse } from '../schema';

/**
 * Echo the message back to the caller.
 * @param event the event from appsync, using generated client types
 */
export const handler = async (event: AppSyncResolverEvent<StartJamArguments>): Promise<StartJamResponse> => {
  // Do the work to kick off the workflow
  console.log(`Starting Jam with id: ${event.arguments.id}`);
  return {
    id: event.arguments.id,
  };
};
