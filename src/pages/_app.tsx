import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import NextHeadSeo from "next-head-seo";
import { Notifications } from "@mantine/notifications";
import { FirebaseAuthContextProvider } from "@/auth/AuthContext";
import "@/styles/globals.scss";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
        }}
      >
        <FirebaseAuthContextProvider>
          <NextHeadSeo
            title="React Board"
            canonical="https://board.rayhan.dev"
          />
          <Notifications />
          <Component {...pageProps} />
        </FirebaseAuthContextProvider>
      </MantineProvider>
    </>
  );
}
