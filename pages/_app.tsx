import * as React from 'react'
import Head from 'next/head'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from '../config/theme'
import createEmotionCache from '../config/createEmotionCache'

const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}


function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }: MyAppProps) {
  
  return ( 
      <CacheProvider value={emotionCache} >
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider> 
      </CacheProvider>
    )
}

export default MyApp
