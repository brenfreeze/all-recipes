import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";
import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";

import AppAppBar from "@/components/AppAppBar";
import { store } from "@/store";
import theme from "@/theme";

import "@/styles/globals.css";
import AppSnackBar from "@/components/AppSnackBar";
import CallableConfirm from "@/components/Dialog";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppCacheProvider {...{ Component, pageProps }}>
      <Head>
        <title>All Recipes</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <AppAppBar />
          <Component {...pageProps} />
          <AppSnackBar />
          <CallableConfirm.Root />
        </Provider>
      </ThemeProvider>
    </AppCacheProvider>
  );
}
