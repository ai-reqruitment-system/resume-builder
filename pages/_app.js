import '@/styles/globals.css';
import '@/styles/sweetalert.css';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthProvider } from '@/context/AuthContext';
import { LoadingProvider } from '@/context/LoadingContext';
import { ToastProvider } from '@/components/ui/ToastProvider';
import GlobalLoadingOverlay from '@/components/GlobalLoadingOverlay';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Router } from 'next/router';
import LoadingScreen from '@/components/LoadingScreen';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

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

  // Initialize PostHog and capture pageviews
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
      },
      debug: process.env.NODE_ENV === 'development',
    });

    const handleRouteChange = () => posthog.capture('$pageview');

    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <PostHogProvider client={posthog}>
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
        </AuthProvider>
      </Provider>
    </PostHogProvider>
  );
}
