import { useAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import Link from 'next/link'

export const Navbar = () => {
  const { user } = useAuthenticator((context) => [context.user]);

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Recipes
        </Link>
        <Link href="/my-recipes" className="btn btn-ghost normal-case text-xl">
          New Recipe
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {user && (
            <ul className="menu menu-horizontal px-1">
              <li>
                <span className="normal-case text-l select-none">
                  Welcome {user.username}
                </span>
              </li>
              <li>
                <button onClick={() => Auth.signOut()} className="btn">
                  <span className='normal-case text-l'>Sign Out</span>
                </button>
              </li>
            </ul>
          )}
        </ul>
      </div>
    </div>
  );
}
