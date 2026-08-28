import '@/styles/globals.css';
import 'leaflet/dist/leaflet.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { LanguageProvider } from '@/lib/translations';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Head>
        <title>SwachhApp – Smart Municipal Waste Management Platform</title>
        <meta
          name="description"
          content="A digital spatial AI platform for smart municipal waste management, reporting, and bio-energy monitoring"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
