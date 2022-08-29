import React from 'react';
import { NextPage } from 'next';
import { trpc } from '../../../utils/trpc';
import { useRouter } from 'next/router';
import UserOptions from '../../../components/userOptions';
import { Button, TextField } from '@mui/material';

const CreateIngredient: NextPage = () => {
  const [isInvalid, setIsInvalid] = React.useState(false);

  const router = useRouter();

  const mutation = trpc.useMutation(['ingredient.createIngredient'], {
    onSuccess: () => {
      setIsInvalid(false);
      setTimeout(() => { 
        router.back();
      }, 1000);
    }
  });

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
      <UserOptions />
      <h1>Criar ingrediente</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Nome:</label><br/>
        <TextField type="text" name="name"/>
        <Button variant="contained" type="submit">Criar</Button>'
      </form>
      {mutation.isLoading && <p>Carregando...</p>}
      {(isInvalid || mutation.isError) && <p>Preencha o nome</p>}
      {mutation.isSuccess && <p>Ingrediente criado com sucesso</p>}

    </>
  );
}	

export default CreateIngredient;