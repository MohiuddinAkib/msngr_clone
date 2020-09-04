import React from "react";
import Head from "next/head";
import {AppProps} from "next/app"
import PropTypes from "prop-types";
import {Action, Store} from "redux";
import firebase from "@config/firebase"
import {RootState, wrapper} from "@store/configureStore";
import {ReactReduxContext} from "react-redux";
import {StylesProvider} from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import {createFirestoreInstance} from "redux-firestore"
import {ReactReduxFirebaseProvider} from "react-redux-firebase"


const MyApp: React.FC<AppProps> = (props) => {
    const {Component, pageProps} = props;

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
                <title>My page</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline/>
            <ReactReduxContext.Consumer>
                {
                    (
                        {store}: { store: Store<RootState, Action<string>> }
                    ) => (
                        <ReactReduxFirebaseProvider
                            config={{
                                useFirestoreForProfile: true,
                                useFirestoreForStorageMeta: true
                            }}
                            initializeAuth
                            firebase={firebase}
                            dispatch={store.dispatch}
                            createFirestoreInstance={createFirestoreInstance}
                        >
                            <Component {...pageProps} />
                        </ReactReduxFirebaseProvider>
                    )
                }
            </ReactReduxContext.Consumer>
        </StylesProvider>
    );
}

MyApp.propTypes = {
    pageProps: PropTypes.object.isRequired,
};

export default wrapper.withRedux(MyApp)