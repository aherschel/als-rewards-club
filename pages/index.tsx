import { Navbar } from '@/components/navbar'
import { DeleteTacoRecipeMutation, ListTacoRecipesQuery, TacoRecipe } from '@/codegen/API'
import { deleteTacoRecipe } from '@/codegen/graphql/mutations'
import { listTacoRecipes } from '@/codegen/graphql/queries'
import { GraphQLResult } from '@aws-amplify/api-graphql'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { API } from 'aws-amplify'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function Home() {
  const [recipes, setRecipes] = useState<[] | TacoRecipe[]>([]);
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const response = await API.graphql({
          query: listTacoRecipes,
          authMode: user ? 'AMAZON_COGNITO_USER_POOLS' : 'AWS_IAM',
        }) as GraphQLResult<ListTacoRecipesQuery>;

        if (response.errors) {
          throw new Error(`Received API error: ${JSON.stringify(response.errors, null, 2)}`);
        }
        
        const items = response.data?.listTacoRecipes?.items ?? [];
        setRecipes(items.filter((item): item is TacoRecipe => Boolean(item)));
      } catch (e) {
        console.error('Caught exception while loading recipes', e);
      }
    };

    loadRecipes();
  }, [user])

  const handleRecipeDelete = async (id: string) => {
    if (user) {
      try {
        const response = await API.graphql({
          query: deleteTacoRecipe,
          variables: { input: { id } },
        }) as GraphQLResult<DeleteTacoRecipeMutation>;

        if (response.errors) {
          throw new Error(`Received API error: ${JSON.stringify(response.errors, null, 2)}`);
        }
      } catch (e) {
        console.error('Exception caught while deleting recipe.', e);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
        <h1 className="text-5xl font-bold">My Awesome Recipe App!</h1>
        <p className="py-6">
          Let&apos;s see what I&apos;m cooking up these days!
        </p>
        <Link href={'/my-recipes'} className="btn btn-primary">
          Get Started
        </Link>
        </div>
      </div>
      </div>
      <section className="flex justify-center mt-6">
      <ul className="flex">
        {recipes.map((recipe) => (
        <li onClick={() => { handleRecipeDelete(recipe.id) }} className="m-3" key={recipe.id}>
          <div className="card w-96 bg-secondary text-primary-content">
          <div className="card-body">
            <h2 className="card-title">{recipe.title}</h2>
            <p>{recipe.description}</p>
          </div>
          </div>
        </li>
        ))}
      </ul>
      </section>
    </>
  );
}

export default Home;
