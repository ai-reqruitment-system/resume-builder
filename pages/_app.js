import '@/styles/globals.css';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ui/ToastProvider';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Provider store={store}>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </Provider>
    </AuthProvider>
  );
}
