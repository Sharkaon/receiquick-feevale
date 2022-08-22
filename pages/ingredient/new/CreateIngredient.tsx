import React from 'react';
import { NextPage } from 'next';
import { trpc } from '../../../utils/trpc';

const createIngredient: NextPage = () => {
  const [isInvalid, setIsInvalid] = React.useState(false);
  const mutation = trpc.useMutation(['ingredient.createIngredient']);

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
      <h1>Criar ingrediente</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Nome:</label><br/>
        <input type="text" name="name"/>
        <button type="submit">Criar</button>
      </form>
      {mutation.isLoading && <p>Carregando...</p>}
      {(isInvalid || mutation.isError) && <p>Preencha o nome</p>}
      {mutation.isSuccess && <p>Ingrediente criado com sucesso</p>}

    </>
  );
}	

export default createIngredient;