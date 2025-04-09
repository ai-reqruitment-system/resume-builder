<<<<<<< HEAD
import '@/styles/globals.css';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ui/ToastProvider';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </AuthProvider>
    </Provider>
  );
=======
import { Inter } from 'next/font/google'
import '../styles/globals.css'
const inter = Inter({ subsets: ['latin'] })
import { AuthProvider } from '../context/AuthContext'
export default function App({ Component, pageProps }) {
  return (
      <AuthProvider>
          <Component {...pageProps} />
      </AuthProvider>
  )
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
}
