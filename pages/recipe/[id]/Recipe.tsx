import { NextPage } from "next"
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";

const Recipe: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const res = trpc.useQuery(['recipe.recipe', { id: parseInt(id, 10) }]);
  const deleteMutation = trpc.useMutation(['recipe.deleteRecipe'], {
    onSuccess: () => router.back(),
  });

  const handleClickDelete: React.FormEventHandler<HTMLButtonElement> = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteMutation.mutate(parseInt(id, 10));
  }

  return (
    <>
      {!res ? 'Carregando...' : res?.data?.name}<br/>
      Ingredientes: {res?.data?.ingredients?.map(i => i.ingredient.name).join(', ')}<br/>
      <button onClick={(e) => handleClickDelete(e)} name="delete">
        Excluir
      </button>
      <Link href={{
        pathname: '/recipe/[id]/edit',
        query: { id }
      }}>
        <button>Editar</button>
      </Link>
      {deleteMutation.isError && <p>Erro ao excluir</p>}
      {deleteMutation.isLoading && <p>Carregando...</p>}
    </>
  );
}

export default Recipe;