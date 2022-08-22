import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <>
      <Link href='/ingredient'>
        <a>Ingrediente</a>
      </Link>
      <br/>
      <Link href="/recipe">
        <a>Receitas</a>
      </Link>
    </>
  )
}

export default Home;
