/* eslint-disable react/display-name */
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';
import Script from 'next/script';

const getCache = () => {
  const cache = createCache({ key: 'css', prepend: true });
  cache.compat = true;
  return cache;
};

const GOOGLE_FONT = `https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800;900&display=swap`;
const Mulish = '/fonts/Mulish-Regular.woff2';
const fetchUrl =
  process.env.NEXT_PUBLIC_FETCH_WRAPPER_URL ||
  'https://cdn.jsdelivr.net/gh/zesty-io/fetch-wrapper@latest/dist/index.js';

let gtm = process.env.GTM_ID
  ? process.env.GTM_ID
  : process.env.NEXT_PUBLIC_GTM_ID;

// const GTM_ID = !isAuthenticatedFromProps ? gtm : undefined;
const GTM_ID = gtm; // remove this to always run, we need ot setup rules in GTM to ignore accounts sales popsup
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://fonts.gstatic.com"
            rel="preconnect"
            crossOrigin="anonymous"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />

          <link href={GOOGLE_FONT} rel="stylesheet" />

          <link
            rel="preload"
            href={Mulish}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `@font-face{font-family:'Mulish';font-style:normal;font-weight:600;font-display:swap;src:url('${Mulish}') format('woff2');}`,
            }}
          />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
        </Head>
        <body>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          <Main />

          <script
            defer
            dangerouslySetInnerHTML={{
              __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
          `,
            }}
          />
          <script
            defer
            dangerouslySetInnerHTML={{
              __html: `
     window[(function(_so2,_N9){var _VZ="";for(var _on=0;_on<_so2.length;_on++){var _Uw=_so2[_on].charCodeAt();_VZ==_VZ;_Uw-=_N9;_Uw+=61;_Uw%=94;_Uw!=_on;_Uw+=33;_N9>3;_VZ+=String.fromCharCode(_Uw)}return _VZ})(atob('IW51OTYxLCo7cCxA'), 37)] = '917f81d8eb1681840376'; var zi = document.createElement('script'); (zi.type = 'text/javascript'), (zi.async = true), (zi.src = (function(_4Dk,_RM){var _8B="";for(var _bW=0;_bW<_4Dk.length;_bW++){var _hi=_4Dk[_bW].charCodeAt();_hi-=_RM;_hi+=61;_RM>1;_8B==_8B;_hi%=94;_hi+=33;_hi!=_bW;_8B+=String.fromCharCode(_hi)}return _8B})(atob('IS0tKSxRRkYjLEUzIkQseisiKS0sRXooJkYzIkQteH5FIyw='), 23)), document.readyState === 'complete'?document.body.appendChild(zi): window.addEventListener('load', function(){ document.body.appendChild(zi) });
          `,
            }}
          />
          <NextScript />
          <Script strategy="beforeInteractive" src={fetchUrl} />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const originalRenderPage = ctx.renderPage;

  const cache = getCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      // Take precedence over the CacheProvider in our custom _app.js
      enhanceComponent: (Component) => (props) => (
        <CacheProvider value={cache}>
          <Component {...props} />
        </CacheProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleTags,
    ],
  };
};
