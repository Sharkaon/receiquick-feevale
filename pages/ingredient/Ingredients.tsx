import Link from 'next/link';
import { NextPage } from 'next';
import { trpc } from '../../utils/trpc';

const Ingredients: NextPage = () => {
  const res = trpc.useQuery(['ingredient.ingredients']);

  return (
    <>
      <h1>Ingredientes!</h1>
      {!res || !res.data? 'Carregando...' : res.data?.map((ingredient) => (
        <Link key={ingredient.id} href={{
          pathname: '/ingredient/[id]',
          query: { id: ingredient.id }
        }}>
          <a><li key={ingredient.id}>{ingredient.name}</li></a>
        </Link>
      ))}

      <Link href="/ingredient/new">
        <a><h4>Criar ingrediente</h4></a>
      </Link>
    </>
  );
}

export default Ingredients