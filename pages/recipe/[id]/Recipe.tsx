import { Button } from "@mui/material";
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
      <Link href="/recipe">
        <Button>Voltar</Button>
      </Link>
      <h1>{!res ? 'Carregando...' : res?.data?.name}</h1>
      <h4>Ingredientes:</h4>
      {res?.data?.ingredients?.map(i => (
        <p>{i.ingredient?.name} ({i.amount})</p>
      ))}
      <br/>
      <div>
        <Button color="error" variant="contained" onClick={(e) => handleClickDelete(e)} name="delete">
          Excluir
        </Button>
        <Link href={{
          pathname: '/recipe/[id]/edit',
          query: { id }
        }}>
          <Button variant="contained" color="secondary">Editar</Button>
        </Link>
      </div>
      {deleteMutation.isError && <p>Erro ao excluir</p>}
      {deleteMutation.isLoading && <p>Carregando...</p>}
    </>
  );
}

export default Recipe;