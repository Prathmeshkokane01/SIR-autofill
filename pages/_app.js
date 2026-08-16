import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { LangProvider } from "../components/LangContext";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <LangProvider>
        <Component {...pageProps} />
      </LangProvider>
    </SessionProvider>
  );
}
