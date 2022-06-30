import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Auth0Provider } from "@auth0/auth0-react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_AUTH_DOMAIN}
        clientId={process.env.NEXT_PUBLIC_AUTH_CLIENT_ID}
        audience={process.env.NEXT_PUBLIC_AUTH_AUDIENCE}
        redirectUri={process.env.NEXT_PUBLIC_WEB_APP_BASE_URL}
        scope="openid profile email"
        useRefreshTokens={true}
        cacheLocation="localstorage"
      >
        <Component {...pageProps} />
      </Auth0Provider>
    </>
  );
}

export default MyApp;
