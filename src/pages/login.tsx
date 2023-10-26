import {FormEvent, useContext, useState, useEffect} from 'react';
import axios, {AxiosError} from 'axios';
import {toast} from 'react-toastify';
import Spinner from '@/components/Spinner';
import {ApiValidationError, toValidationErrorString} from '@/utils/api';
import {Context} from '@/context';
import { useRouter } from 'next/router';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { state: { user }, dispatch } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    user && router.push('/');
  }, [user]);

  // const onClick = async (event: FormEvent) => {
  //   event.preventDefault();
  //
  //   try {
  //     await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_PATH}/auth/send-email`, {email});
  //
  //     await router.push('/reset-password');
  //
  //   } catch (err: unknown) {
  //     const unexpectedErrorMessage: string = 'Unexpected error during sending verification code.';
  //     if(!(err instanceof AxiosError)) return toast.error(unexpectedErrorMessage);
  //     const errorData = err?.response?.data;
  //
  //     if(!errorData) return toast.error(unexpectedErrorMessage);
  //
  //     const { errors: validationErrors, message } = errorData;
  //
  //     if(!validationErrors) return toast.error(message || unexpectedErrorMessage);
  //
  //     return validationErrors.map((error: ApiValidationError) => toast.error(toValidationErrorString(error)));
  //   }
  // };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setIsLoading(true);

      const mutation = {
        operationName: 'login',
        query: 'mutation login($loginInput: LoginUserInput!) { login(loginUserInput: $loginInput) { access_token user { id username role picture_link } } }',
        variables: {
          loginInput: {
            username: login,
            password: password
          }
        }
      }

      const { data } = await axios({
        method: 'post',
        url: 'https://tattoo-server.onrender.com/graphql',
        data: mutation,
        headers: { 'Content-Type': 'application/json' },
      });

      const { errors } = data;

      if(errors) return errors.map((error: ApiValidationError) => toast.error(error.message));

      dispatch({
        type: 'LOGIN',
        payload: data.data.login.user
      });

      window.localStorage.setItem('user', JSON.stringify(data.data.login.user));

      toast.success('Login successful.');

      await router.push('/');
    } catch (err: unknown) {
      return toast.error('Unexpected error during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return <>
    <h1 className={'jumbotron text-center bg-primary square'}>Login</h1>
    <div className={'container col-md-4 offset-md-4 pb-5 mt-5'}>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          className={'form-control mb-4 p-4'}
          value={login}
          placeholder='Enter email'
          onChange={(event) => setLogin(event.target.value)}
        />
        <input
          type='password'
          className={'form-control mb-4 p-4'}
          value={password}
          placeholder='Enter password'
          onChange={(event) => setPassword(event.target.value)}
        />
        <div className="submit-button">
          {isLoading ? <Spinner /> : <button type = 'submit' className={'btn col-12 btn-primary'}>Submit</button>}
        </div>

        {/*<a */}
        {/*  onClick={onClick} */}
        {/*  className={'text-center p-5 d-block'} */}
        {/*  style={{ color: 'green', fontSize: '24px', cursor: 'pointer' }}>*/}
        {/*  Click if you forgot your password*/}
        {/*</a>*/}
      </form>
    </div>
  </>;
};


export default Login;
