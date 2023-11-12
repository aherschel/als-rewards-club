import Head from 'next/head'
import { Navbar, Footer } from '@/components'
import { useAuthenticator } from '@aws-amplify/ui-react'
import Image from 'next/image';

const Home = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  return (
    <>
      <Head>
        <title>Al&apos;s Rewards Club</title>
      </Head>
      <Navbar user={user} />
      <section className="flex justify-center mt-6">
        <Image
          src="/under-construction.gif"
          width={500}
          height={500}
          alt="Picture of the author"
        />
      </section>
      <Footer />
    </>
  );
};

export default Home;
