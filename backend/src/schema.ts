import { a, ClientSchema } from '@aws-amplify/data-schema';

const ownerEditPublicRead = [
  a.allow.owner('userPools'),
  a.allow.public().to(['read']),
];

const Jam = a.model({
  title: a.string().required(),
  description: a.string().required(),
  executions: a.hasMany('Execution'),
  notes: a.hasMany('Note'),
});

const Note = a.model({
  content: a.string().array(),
  jam: a.belongsTo('Jam'),
  execution: a.belongsTo('Execution'),
});

const Execution = a.model({
  jam: a.belongsTo('Jam'),
  notes: a.hasMany('Note'),
  startDate: a.date(),
  endDate: a.date(),
});

export const schema = a.schema(Object.fromEntries(Object.entries({
  Jam,
  Execution,
  Note,
}).map(([modelName, modelDef]) => [modelName, modelDef.authorization(ownerEditPublicRead)])));

export type Schema = ClientSchema<typeof schema>;
