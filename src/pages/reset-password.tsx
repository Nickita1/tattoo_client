import {FormEvent, useContext, useState, useEffect} from 'react';
import axios, {AxiosError} from 'axios';
import {toast} from 'react-toastify';
import Spinner from '@/components/Spinner';
import {ApiValidationError, toValidationErrorString} from '@/utils/api';
import {Context} from '@/context';
import { useRouter } from 'next/router';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { state: { user }, dispatch } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    user && router.push('/');
  }, [user]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setIsLoading(true);

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_PATH}/auth/change-password`, {password, verificationCode});

      toast.success('Password changed.');

      await router.push('/login');
    } catch (err: unknown) {
      if(!(err instanceof AxiosError)) return toast.error('Unexpected error during password changing.');
      const errorData = err?.response?.data;

      if(!errorData) return toast.error('Unexpected error password changing.');

      const { errors: validationErrors, message } = errorData;

      if(!validationErrors) return toast.error(message || 'Unexpected error password changing.');

      return validationErrors.map((error: ApiValidationError) => toast.error(toValidationErrorString(error)));
    } finally {
      setIsLoading(false);
    }
  };

  return <>
    <h1 className={'jumbotron text-center bg-primary square'}>Reset Password</h1>
    <div className={'container col-md-4 offset-md-4 pb-5 mt-5'}>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          className={'form-control mb-4 p-4'}
          value={verificationCode}
          placeholder='Enter received code'
          onChange={(event) => setVerificationCode(event.target.value)}
        />
        <input
          type='password'
          className={'form-control mb-4 p-4'}
          value={password}
          placeholder='Enter new password'
          onChange={(event) => setPassword(event.target.value)}
        />
        <div className="submit-button">
          {isLoading ? <Spinner /> : <button type = 'submit' className={'btn col-12 btn-primary'}>Submit</button>}
        </div>
      </form>
    </div>
  </>;
};

export default ResetPassword;
