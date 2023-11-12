import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Head from 'next/head'
import { JamList } from '@/components/jam-list'
import { useAuthenticator } from '@aws-amplify/ui-react'

const Jams = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  return (
    <>
      <Head>
        <title>Al&apos;s Rewards Club - Jams</title>
      </Head>
      <Navbar user={user} />
      <JamList user={user} />
      <Footer />
    </>
  );
};

export default Jams;
