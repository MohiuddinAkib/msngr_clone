import React from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import { AppProps } from "next/app";
import "emoji-mart/css/emoji-mart.css";
import { wrapper } from "@store/configureStore";
import AppProvider from "@src/context/AppProvider";
import { StylesProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import "@webscopeio/react-textarea-autocomplete/style.css";

const MyApp: React.FC<AppProps> = (props) => {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <StylesProvider injectFirst>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <CssBaseline />

      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </StylesProvider>
  );
};

MyApp.propTypes = {
  pageProps: PropTypes.object.isRequired,
};

export default wrapper.withRedux(MyApp);
