import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { Toaster } from 'react-hot-toast';

const desiredChainId = ChainId.Mumbai;

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <ThirdwebProvider desiredChainId={desiredChainId}>
    <Component {...pageProps}/>
    <Toaster></Toaster>
  </ThirdwebProvider>
  )
}

export default MyApp
