import React from 'react'
import { useRouter } from 'next/router'
import {
  FormControl,
  TextField,
  Button
} from '@mui/material';
import { trpc } from '../utils/trpc';
import { UserContext } from '../contexts/UserContext';
import { User } from '../types/UserTypes';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [wrongEmail, setWrongEmail] = React.useState(false);
  const { user, loginUser } = React.useContext(UserContext);

  const adminUsers = [
    'arturkontzm@gmail.com'
  ]
  
  const { data, refetch } = trpc.useQuery(['user.user', { email }], {
    enabled: false,
    onSuccess: (loginResponse) => {
      if (loginResponse) {
        const loggedUser: User = {
          id: loginResponse.id,
          name: loginResponse.name,
          email: loginResponse.email,
          role: adminUsers.includes(loginResponse.email) ? 'ADMIN' : 'USER'
        };
        loginUser(loggedUser);
        router.push('/recipe');
      } else {
        setWrongEmail(true);
      }
    }
  });

  const handleSubmitLogin: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  }

  return (
    <>
      <h1>Login</h1>

      <form onSubmit={(e) => handleSubmitLogin(e)}>
        <TextField id='email-input' className='mb-1' label='Email' variant='outlined' onChange={(e) => setEmail(e.target.value)}/>
        <Button type='submit' variant='contained'><span>Conectar</span></Button>
      </form>

      {wrongEmail && 'Email inválido'}
    </>
  )
}