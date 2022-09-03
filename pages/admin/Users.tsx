import React from 'react';
import { Button, TextField } from '@mui/material';
import { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import UserOptions from '../../components/userOptions';

const Users: NextPage = () => {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');

  const signinMutate = trpc.useMutation(['user.createUser'], {
    onSuccess: () => {
      setEmail('');
      setName('');
    }
  });
  const res = trpc.useQuery(['user.users']);

  const handleSubmitSignin: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signinMutate.mutate({ email, name });
  }

  return (
    <>
      <UserOptions />
      <h1>Cadastro</h1>

      <form onSubmit={(e) => handleSubmitSignin(e)}>
        <TextField id='name-input' label='Nome' variant='outlined' onChange={(e) => setName(e.target.value)}/>
        <TextField id='email-input' label='Email' variant='outlined' onChange={(e) => setEmail(e.target.value)}/>
        <Button type='submit' variant="contained"><span>Criar</span></Button>
      </form>

      {signinMutate.isLoading && <p>Carregando...</p>}
      {signinMutate.isSuccess && <p>Usuário criado com sucesso!</p>}

      {res?.data && res?.data.length > 0 && (
        <>
          <h2>Users</h2>
          <ul>
            {res?.data.map(user => (
              <li key={user.id}>
                {user.name} - {user.email}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default Users;