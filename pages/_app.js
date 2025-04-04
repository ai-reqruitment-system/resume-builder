import { Inter } from 'next/font/google'
import '../styles/globals.css'
const inter = Inter({ subsets: ['latin'] })
import { AuthProvider } from '../context/AuthContext'
import { Provider } from 'react-redux'
import { store } from '../store'

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Provider>
  )
}
