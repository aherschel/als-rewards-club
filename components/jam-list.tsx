import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '@/backend/src/schema';

const client = generateClient<Schema>();

export type JamListProps = {
  user?: any;
};

export const JamList = ({ user }: JamListProps) => {
  const [jams, setJams] = useState<Schema['Jam'][]>([]);

  useEffect(() => {
    generateClient<Schema>().models.Jam
      .observeQuery({ authMode: 'iam' })
      .subscribe((values) => setJams(values.items));
  }, [user]);

  const startJam = async (id: string) => {
    const startJamResponse = await client.graphql({
      query: /* GraphQL */ `
        query StartJam($id: String!) {
          StartJam(id: $id) {
            id
          }
        }
      `,
      variables: { id },
      authMode: 'iam',
    });
    console.log(`Got startJamResponse: ${JSON.stringify(startJamResponse, null, 2)}`);
  };

  return (
    <section className="flex justify-center mt-6">
      <ul className="flex">
        {jams.map((jam) => (
        <li className="m-3" key={jam.id}>
          <div className="card w-96 bg-secondary text-primary-content">
          <div className="card-body">
            <h2 className="card-title">{jam.title}</h2>
            <p>{jam.description}</p>
            <button onClick={() => startJam(jam.id)} className="btn btn-primary">Start</button>
          </div>
          </div>
        </li>
        ))}
      </ul>
    </section>
  );
};
