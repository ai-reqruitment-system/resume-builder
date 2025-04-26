import '@/styles/globals.css';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthProvider } from '@/context/AuthContext';
import { LoadingProvider } from '@/context/LoadingContext';
import { ToastProvider } from '@/components/ui/ToastProvider';
import GlobalLoadingOverlay from '@/components/GlobalLoadingOverlay';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(false);

  // Handle page transition loading states
  useEffect(() => {
    const handleStart = () => setPageLoading(true);
    const handleComplete = () => setPageLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <Provider store={store}>
      <AuthProvider>
        <LoadingProvider>
          <ToastProvider>
            {pageLoading ? (
              <LoadingScreen message="Loading page..." />
            ) : (
              <>
                <GlobalLoadingOverlay />
                <Component {...pageProps} />
              </>
            )}
          </ToastProvider>
        </LoadingProvider>
      </AuthProvider >
    </Provider>
  );
}