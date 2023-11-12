import { useEffect, useState } from 'react';
import { AmplifyUser } from '@aws-amplify/ui'
import { generateClient } from 'aws-amplify/api';
import { Schema } from '@/backend/src/schema';

export type JamListProps = {
  user?: AmplifyUser;
};

export const JamList = ({ user }: JamListProps) => {
  const [jams, setJams] = useState<any[]>([]);

  useEffect(() => {
    generateClient<Schema>().models.Jam.observeQuery().subscribe((values) => setJams(values.items));
  }, [user]);

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
