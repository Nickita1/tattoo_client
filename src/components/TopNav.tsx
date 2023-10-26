import { useContext, useState, useEffect } from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import { LoginOutlined, AppstoreOutlined, UserAddOutlined, FolderAddOutlined, LogoutOutlined, CoffeeOutlined, UserOutlined } from '@ant-design/icons';
import { Context } from '@/context';
import axios, {AxiosError} from 'axios';
import {toast} from 'react-toastify';
import {ApiValidationError, toValidationErrorString} from '@/utils/api';
import { useRouter } from 'next/router';

const { Item, SubMenu } = Menu;

const TopNav = () => {
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState('');
  useEffect(() => {
    setCurrentLocation(router.pathname);
  }, [router.pathname]);

  const logout = async() => {
    try {
      dispatch({type: 'LOGOUT'});

      window.localStorage.removeItem('user');

      await router.push('/login');

      toast.success('Successful logout');
    } catch (err) {
      if(!(err instanceof AxiosError)) return toast.error('Unexpected error during logout.');

      const errorData = err?.response?.data;

      if(!errorData) return toast.error('Unexpected error during logout.');

      const { errors: validationErrors, message } = errorData;

      if(!validationErrors) return toast.error(message || 'Unexpected error during logout.');

      return validationErrors.map((error: ApiValidationError) => toast.error(toValidationErrorString(error)));
    }
  };

  return <Menu 
    style={{display: 'inline-block', width: '100%'}}
    mode="horizontal"
    selectedKeys={[currentLocation]}>
    <Item key='/' icon={<AppstoreOutlined />}>
      <Link href='/'>
        App
      </Link>
    </Item>

    { !user ? (
      <>
        <Item key='/login' icon={<LoginOutlined />}>
          <Link href='/login'>
                Login
          </Link>
        </Item>

        <Item key='/register' icon={<UserAddOutlined />}>
          <Link href='/register'>
                Register
          </Link>
        </Item>
      </>
    ) : (
      <SubMenu icon={<CoffeeOutlined />} title={user.username}>

        <Item icon={<UserOutlined />} style={{float: 'right'}}>
          <Link href='/user'>
            Profile
          </Link>
        </Item>

        <Item onClick={logout} icon={<LogoutOutlined />}>
          <Link href='/'>
            Logout
          </Link>
        </Item>
      </SubMenu>
    )}
  </Menu>;
};

export default TopNav;