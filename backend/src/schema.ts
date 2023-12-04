import { a, ClientSchema } from '@aws-amplify/data-schema';

// Setup types and exports for start-jam function

const startJamArgumentFields = { id: a.string().required() };
const StartJamResponse = a.customType({ id: a.string().required() });

// Generate an internal schema to produce function typings
const startJamTypeSchema = a.schema({
  StartJamArguments: a.customType(startJamArgumentFields),
  StartJamResponse,
  StartJamAnchor: a.model({ // Anchor model exposed to give me typing for the lambda, no access to this is exposed
    arguments: a.ref('StartJamArguments').required(),
    response: a.ref('StartJamResponse').required(),
  }),
});
type StartJamTypes = ClientSchema<typeof startJamTypeSchema>['StartJamAnchor'];
export type StartJamArguments = StartJamTypes['arguments'];
export type StartJamResponse = StartJamTypes['response'];

// Expose schema for api building.

export const schema = a.schema({
  Jam: a.model({
    title: a.string().required(),
    description: a.string().required(),
    executions: a.hasMany('Execution'),
    notes: a.hasMany('Note'),
  }).authorization([
    a.allow.owner('userPools'),
    a.allow.public('iam').to(['read']),
    a.allow.private('iam').to(['read']),
  ]),

  Execution: a.model({
    jam: a.belongsTo('Jam'),
    notes: a.hasMany('Note'),
    startDate: a.date(),
    endDate: a.date(),
  }).authorization([
    a.allow.owner('userPools'),
    a.allow.public('iam').to(['read']),
    a.allow.private('iam').to(['read']),
  ]),

  Note: a.model({
    content: a.string().array(),
    jam: a.belongsTo('Jam'),
    execution: a.belongsTo('Execution'),
  }).authorization([
    a.allow.owner('userPools'),
    a.allow.public('iam').to(['read']),
    a.allow.private('iam').to(['read']),
  ]),

  StartJamResponse,
  StartJam: a.query()
    .arguments(startJamArgumentFields)
    .returns(a.ref('StartJamResponse'))
    .function('StartJam')
    .authorization([
      a.allow.public('iam'),
      a.allow.private('iam'),
    ]),
});

export type Schema = ClientSchema<typeof schema>;
