import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../../../../utils/trpc";

const EditIngredient: NextPage = () => {
  const [isSuccess, setIsSuccess] = React.useState(false);

  const router = useRouter();
  const { id } = router.query as { id: string };

  const trpcUtils = trpc.useContext();

  const res = trpc.useQuery(['ingredient.ingredient', { id: parseInt(id, 10) }]);
  const editMutation = trpc.useMutation(['ingredient.updateIngredient'], {
    onSuccess(input) {
      trpcUtils.invalidateQueries(['ingredient.ingredient', { id: input.id }]);
      setIsSuccess(true);
    }
  });
  const deleteMutation = trpc.useMutation(['ingredient.deleteIngredient'], {
    onSuccess: () => router.back(),
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
    };
    if (e.target instanceof EventTarget && target.name.value) {
      editMutation.mutate({ id: parseInt(id, 10), data: { name: target.name.value }});
    }
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSuccess(false);
  }

  return (
    <div>
      <h1>Editar Ingrediente</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Nome:</label><br/>
        <input type="text" name="name" onChange={(e) => handleChange(e)} defaultValue={res.data?.name}/>
        <button type="submit">Editar</button>
      </form>
      {isSuccess && <p>Ingrediente editado com sucesso</p>}

      <br/>
      <button onClick={() => deleteMutation.mutate(parseInt(id, 10))}>Deletar</button>
      {deleteMutation.isLoading && <p>Carregando...</p>}
      {deleteMutation.isError && <p>Erro ao deletar</p>}
    </div>
  );
}

export default EditIngredient;