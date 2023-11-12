import { useEffect, useState } from 'react';
import { AmplifyUser } from '@aws-amplify/ui'
import { generateClient } from 'aws-amplify/api';
import { Schema } from '@/backend/src/schema';

export type JamListProps = {
  user?: AmplifyUser;
};

export const JamList = ({ user }: JamListProps) => {
  const [jams, setJams] = useState<any[]>([]);

  const client = generateClient<Schema>();

  const loadJams = async () => {
    try {
      const response = await client.models.Jam.list();
      if (response.errors) throw new Error(`Received API error: ${JSON.stringify(response.errors, null, 2)}`);
      setJams(response.data);
    } catch (e) {
      console.error('Caught exception while loading jams', e);
    }
  };

  useEffect(() => { loadJams() }, [user]);

  return (
    <section className="flex justify-center mt-6">
      <ul className="flex">
        {jams.map((jam) => (
        <li className="m-3" key={jam.id}>
          <div className="card w-96 bg-secondary text-primary-content">
          <div className="card-body">
            <h2 className="card-title">{jam.title}</h2>
            <p>{jam.description}</p>
          </div>
          </div>
        </li>
        ))}
      </ul>
    </section>
  );
};
