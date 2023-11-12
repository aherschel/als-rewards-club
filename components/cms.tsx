import { useEffect, useState } from 'react';
import { AmplifyUser } from '@aws-amplify/ui'
import { generateClient } from 'aws-amplify/api';
import { Schema } from '@/backend/src/schema';
import { JamList } from '.';

export type CmsProps = {
  user: AmplifyUser;
};

export const Cms = ({ user }: CmsProps) => {
  const [jams, setJams] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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

  const createJam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await client.models.Jam.create({ title, description });
      if (response.errors) throw new Error(`Received API error: ${JSON.stringify(response.errors, null, 2)}`);
      setTitle('');
      setDescription('');
      loadJams();
    } catch (e) {
      console.error('Exception caught while creating recipe.', e);
    }
  };

  useEffect(() => { loadJams() }, [user]);

  return (
    <>
      <section className="flex justify-center">
        <form onSubmit={createJam} className="flex flex-col items-center max-w-lg">
          <section>
            <label htmlFor="jam-title" className="label">
              <span className="label-text">What does this Jam focus on?</span>
            </label>
            <input
              id="jam-title"
              name="jam-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Learn skill X"
              className="input input-bordered input-accent w-full"
            />
          </section>
          <section className="mt-4">
            <label htmlFor="jam-description" className="label">
              <span className="label-text">
                What are the goals for this Jam?
              </span>
            </label>
            <textarea
              id="jam-description"
              name="jam-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="First, I'll need to dig into X"
              className="input input-bordered input-accent w-full h-48"
            />
          </section>
          <section className="flex flex-col w-full mt-4">
            <button type="submit" className="btn btn-accent">
              submit
            </button>
          </section>
        </form>
      </section>
      <JamList user={user} />
    </>
  );
};
