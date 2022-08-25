import React from 'react'
import { useRouter } from 'next/router'
import {
  FormControl,
  TextField,
  Button
} from '@mui/material';
import { trpc } from '../utils/trpc';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');

  const signinMutate = trpc.useMutation(['user.createUser']);

  const handleSubmitLogin: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/recipe');
  }

  const handleSubmitSignin: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signinMutate.mutate({ email, name });
  }

  return (
    <>
      <h1>Login</h1>

      <form onSubmit={(e) => handleSubmitLogin(e)}>
        <TextField id='email-input' label='Email' variant='outlined' onChange={(e) => setEmail(e.target.value)}/>
        <Button type='submit' variant="contained"><span>Conectar</span></Button>
      </form>

      <h1>Cadastro</h1>

      <form onSubmit={(e) => handleSubmitSignin(e)}>
        <TextField id='name-input' label='Nome' variant='outlined' onChange={(e) => setName(e.target.value)}/>
        <TextField id='email-input' label='Email' variant='outlined' onChange={(e) => setEmail(e.target.value)}/>
        <Button type='submit' variant="contained"><span>Criar</span></Button>
      </form>
    </>
  )
}