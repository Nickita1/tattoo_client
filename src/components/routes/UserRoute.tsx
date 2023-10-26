import {useEffect, useState, useContext} from 'react';
import {Context} from '@/context';
import { useRouter } from 'next/router';
import axios from 'axios';
import Spinner from '@/components/Spinner';

type UserRouteProps = {
  children: JSX.Element
}

export const UserRoute = ({children}: UserRouteProps) => {
  const [ok, setOk] = useState(false);
  const {state: { user }} = useContext(Context);

  const route = useRouter();

  useEffect(() => {
    !user && route.push('/login');
  }, [user]);

  const getCurrentUser = async (login: string) => {
    try {
      const mutation = {
        query: `query {
            getOneUser(username: "${login}") {
              id
            }
        }`
      }

      const { data } = await axios({
        method: 'post',
        url: 'https://tattoo-server.onrender.com/graphql',
        data: mutation,
        headers: { 'Content-Type': 'application/json' },
      });

      if(!data?.data?.getOneUser?.id) {
        setOk(false);
        return route.push('/login');
      }

      setOk(true);
    } catch (err) {
      setOk(false);
      await route.push('/login');
    }
  };
  
  useEffect( () => {
    (async () => {
      await getCurrentUser(user?.username as string);
    })();
  }, [user?.username]);

  // @ts-ignore
  return <>{ok ? <>{children}</> : <Spinner />}</>;
};

export default UserRoute;