import Link from "next/link";
import { NextPage } from "next"
import { trpc } from "../../utils/trpc";

const Recipes: NextPage = () => {
  const res = trpc.useQuery(['recipe.recipes']);

  return (
    <>
      <h1>Receitas</h1>
      {!res || !res.data? 'Carregando...' : res.data?.map((recipe) => (
        <Link key={recipe.id} href={{
          pathname: '/recipe/[id]',
          query: { id: recipe.id }
        }}>
          <a><li key={recipe.id}>{recipe.name}</li></a>
        </Link>
      ))}
      <Link href="/recipe/new">
        <a><h4>Criar receita</h4></a>
      </Link>
    </>
  )
}

export default Recipes;