import { a, ClientSchema } from '@aws-amplify/data-schema';

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
});

export type Schema = ClientSchema<typeof schema>;
