import type { NextPage } from 'next';
import Login from '../components/login';

const Home: NextPage = () => {
  return (
    <div className="start-page">
      <Login/>
    </div>
  )
}

export default Home;
