import { AmplifyUser } from '@aws-amplify/ui'
import { Auth } from 'aws-amplify'
import Link from 'next/link'

export type NavbarProps = {
  user: AmplifyUser;
};

export const Navbar = ({ user }: NavbarProps) => {
  const email = user?.attributes?.email;
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
              { email && (
                <li>
                  <span className="normal-case text-l select-none">
                    Welcome {email}
                  </span>
                </li>
              )}
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
