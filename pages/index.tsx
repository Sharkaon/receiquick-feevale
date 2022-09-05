import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import Login from '../components/login';

const Home: NextPage = () => {
  return (
    <div className="start-page">
      <Typography variant="h1" className="title">
        Receiquick
      </Typography>
      <Login/>
    </div>
  )
}

export default Home;
