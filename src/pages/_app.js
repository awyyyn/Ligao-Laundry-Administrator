import '@/styles/globals.css'; 
import { ThemeProvider } from '@emotion/react';
import theme from './customization';
import { Provider } from 'react-redux';
import store from './store'

export default function App({ Component, pageProps }) {
  
  return ( 
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} /> 
      </ThemeProvider>
    </Provider>
  )
}