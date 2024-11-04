import Head from 'next/head';
import 'prismjs/themes/prism-tomorrow.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <span className={`theme-${process.env.NEXT_PUBLIC_ANALYTICS_ID}`} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
