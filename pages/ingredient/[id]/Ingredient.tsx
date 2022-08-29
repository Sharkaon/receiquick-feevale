
import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from '../../../utils/trpc';
import UserOptions from "../../../components/userOptions";
import { UserContext } from "../../../contexts/UserContext";

const Ingredient: NextPage = () => {
  const { user, loginUser } = React.useContext(UserContext);
  
  const router = useRouter();
  const { id } = router.query as { id: string };

  React.useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.back();
    }
  }, [user])
  

  const res = trpc.useQuery(['ingredient.ingredient', { id: parseInt(id, 10) }]);
  const deleteMutation = trpc.useMutation(['ingredient.deleteIngredient'], {
    onSuccess: () => router.back(),
  });

  const handleClickDelete: React.FormEventHandler<HTMLButtonElement> = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteMutation.mutate(parseInt(id, 10));
  }

  if (user?.role === 'ADMIN') return (
    <div className="ingredient-bg">
      <UserOptions />
      {res.data?.name}
      <button onClick={(e) => handleClickDelete(e)} name="delete">
        Excluir
      </button>
      {deleteMutation.isError && <p>Erro ao excluir</p>}
      {deleteMutation.isLoading && <p>Carregando...</p>}
      <Link href={{
        pathname: '/ingredient/[id]/edit',
        query: { id }
      }}>
        <button>Editar</button>
      </Link>
    </div>
  ); else {
    return <>Carregando...</>
  }
}

export default Ingredient;