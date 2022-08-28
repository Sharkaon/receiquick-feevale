import { useState } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClientProvider, QueryClient } from 'react-query';
import { withTRPC } from '@trpc/next';
import HomeIcon from '@mui/icons-material/Home';
import { AppRouter } from './api/trpc/[trpc]';
import { UserContext } from '../contexts/UserContext';
import type { User } from '../types/UserTypes';
import Link from 'next/link';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, loginUser: (user) => {
        setUser(user);
      }}}>
        <div className='page'>
          {user && (
            <Link href="recipe"><HomeIcon /></Link>
          )}
          <Component {...pageProps} />
        </div>
      </UserContext.Provider>
    </QueryClientProvider>
  )
}

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // if (process.env.RENDER_INTERNAL_HOSTNAME) {
  //   return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  // }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * Trocar pra URL completa para usar SSR
     * @link https://trpc.io/docs/ssr
     */
    return {
      url: `${getBaseUrl()}/api/trpc`,
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);