import { useState, useContext } from "react";
import { Button } from "@mui/material";
import { NextPage } from "next"
import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "../../../contexts/UserContext";
import { trpc } from "../../../utils/trpc";
import UserOptions from "../../../components/userOptions";

const Recipe: NextPage = () => {
  const [ comment, setComment ] = useState("");
  const [ loadingComments, setLoadingComments ] = useState(true);
  const { user, loginUser } = useContext(UserContext);

  const router = useRouter();
  const { id } = router.query as { id: string };
  const trpcUtils = trpc.useContext();

  const res = trpc.useQuery(['recipe.recipe', { id: parseInt(id, 10) }], {
    onSuccess: () => setLoadingComments(false)
  });
  const deleteMutation = trpc.useMutation(['recipe.deleteRecipe'], {
    onSuccess: () => router.back()
  });
  const createCommentMutation = trpc.useMutation(['comment.createComment'], {
    onSuccess: () => {
      trpcUtils.invalidateQueries(['recipe.recipe', { id: parseInt(id, 10) }]);
    },
  });

  const handleClickDelete: React.FormEventHandler<HTMLButtonElement> = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteMutation.mutate(parseInt(id, 10));
  }

  const handleSubmitComment: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingComments(true);
    createCommentMutation.mutate({
      recipeId: parseInt(id, 10),
      userId: user ? user.id : 1,
      description: comment,
    });
  }

  return (
    <>
      <UserOptions />
      <Link href="/recipe">
        <Button>Voltar</Button>
      </Link>
      <h1>{!res || !res?.data ? 'Carregando...' : res?.data?.name}</h1>
      <h4>Ingredientes:</h4>
      {res?.data?.ingredients?.map(i => (
        <p key={i.ingredient?.id}>{i.ingredient?.name} ({i.amount})</p>
      ))}
      <br/>
      {res?.data?.Steps?.map((s, index) => (
        <div key={s.id}>
          <p key={s.id}>{index} - {s.description}</p>
        </div>
      ))}
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

      {user && user.id && (
        <div>
          <h3>Insira um comentário</h3>
          <form onSubmit={handleSubmitComment}>
            <textarea name="comment" id="comment" cols={30} rows={10} onChange={(e) => setComment(e.target.value)} />
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}

      {res?.data?.comments?.map(c => (
        <div key={c.id}>
          <p>{c.user?.name}: {c.description}</p>
        </div>
      ))}

      {loadingComments && <p>Carregando comentários...</p>}
    </>
  );
}

export default Recipe;