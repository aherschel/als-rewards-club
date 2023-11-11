import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CreateRecipeMutation } from '@/codegen/API'
import { createRecipe } from '@/codegen/graphql/mutations'
import { GraphQLResult } from '@aws-amplify/api-graphql'
import { Authenticator } from '@aws-amplify/ui-react'
import { API } from 'aws-amplify'
import { useState } from 'react'
import Router from 'next/router'
import Head from 'next/head'
import { useAuthenticator } from '@aws-amplify/ui-react'

const MyRecipes = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await API.graphql({
        query: createRecipe,
        variables: {
          input: {
            title,
            description,
          },
        },
      }) as GraphQLResult<CreateRecipeMutation>;

      if (response.errors) {
        throw new Error(`Received API error: ${JSON.stringify(response.errors, null, 2)}`);
      }

      Router.push('/');
    } catch (e) {
      console.error('Exception caught while creating recipe.', e);
    }
  };

  return (
    <>
      <Head>
        <title>Al&apos;s Rewards Club</title>
      </Head>
      <Navbar user={user} />
      <Authenticator signUpAttributes={['email']}>
        <section className="flex justify-center">
          <form onSubmit={handleSubmit} className="flex flex-col items-center max-w-lg">
            <section>
              <label htmlFor="recipe-title" className="label">
                <span className="label-text">What is the recipe title?</span>
              </label>
              <input
                id="recipe-title"
                name="recipe-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Hawaiian Tacos"
                className="input input-bordered input-accent w-full"
              />
            </section>
            <section className="mt-4">
              <label htmlFor="recipe-description" className="label">
                <span className="label-text">
                  What is the recipe description?
                </span>
              </label>
              <textarea
                id="recipe-description"
                name="recipe-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Start with corn tortilla..."
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
      </Authenticator>
      <Footer />
    </>
  );
};

export default MyRecipes;
