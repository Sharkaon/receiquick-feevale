import { Button } from "@mui/material";
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';

type HandlerTargetedClick = (e: React.FormEvent<HTMLButtonElement>, id: number) => void;

const DeleteRecipe = ({ id }: { id: number }) => {
  const router = useRouter();

  const deleteMutation = trpc.useMutation(['recipe.deleteRecipe'], {
    onSuccess: () => router.back(),
  });
  
  const handleClickDelete: HandlerTargetedClick = (e, id) => {
    e.preventDefault();
    deleteMutation.mutate(id);
  }

  return (
    <>
      <Button onClick={(e) => handleClickDelete(e, id)} color="error" variant="contained">
        Excluir
      </Button>
      {deleteMutation.isError && <p>Erro ao excluir</p>}
      {deleteMutation.isLoading && <p>Carregando...</p>}
    </>
  );
}

export default DeleteRecipe;
