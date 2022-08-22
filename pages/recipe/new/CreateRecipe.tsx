import { NextPage } from "next";
import React from "react";
import { trpc } from "../../../utils/trpc";

const CreateRecipe: NextPage = () => {
  const [isInvalid, setIsInvalid] = React.useState(false);
  const mutation = trpc.useMutation(['recipe.createRecipe']);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
    };
    if (e.target instanceof EventTarget && target.name.value) {
      mutation.mutate({ name: target.name.value });
      setIsInvalid(false);
      target.name.value = '';
    } else {
      setIsInvalid(true);
    }
  }

  return (
    <>
      <h1>Criar Receita</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Nome:</label><br/>
        <input type="text" name="name"/>
        <button type="submit">Criar</button>
      </form>
      {mutation.isLoading && <p>Carregando...</p>}
      {(isInvalid || mutation.isError) && <p>Preencha o nome</p>}
      {mutation.isSuccess && <p>Receita criada com sucesso</p>}
    </>
  );
}

export default CreateRecipe;