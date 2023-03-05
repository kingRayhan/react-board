import { FirebaseAuthContextProvider } from "@/auth/AuthContext";
import "@/styles/globals.scss";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import NextHeadSeo from "next-head-seo";
import { AppProps } from "next/app";
import Head from "next/head";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>React Board</title>
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
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </FirebaseAuthContextProvider>
      </MantineProvider>
    </>
  );
}
