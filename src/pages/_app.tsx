import TopNav from '../components/TopNav';
import '@/styles/globals.css';
import '@/styles/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import 'antd/dist/antd.css';
import type { AppProps } from 'next/app';
import { Provider } from '../context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <ToastContainer position={'top-center'} />
      <TopNav />
      <Component {...pageProps} />
    </Provider>
  );
}
