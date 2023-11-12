import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Authenticator } from '@aws-amplify/ui-react'
import Head from 'next/head'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { Cms } from '@/components'

const MyJams = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  return (
    <>
      <Head>
        <title>Al&apos;s Rewards Club - My Jams</title>
      </Head>
      <Navbar user={user} />
      <Authenticator signUpAttributes={['email']}>
        <Cms user={user} />
      </Authenticator>
      <Footer />
    </>
  );
};

export default MyJams;
