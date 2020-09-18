import React from "react";
import {ServerStyleSheet} from "styled-components"
import Document from "@expo/next-adapter/document";
import {Head, Main, NextScript} from "next/document";
import {ServerStyleSheets} from "@material-ui/core/styles";


class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const originalRenderPage = ctx.renderPage;
        const materialSheets = new ServerStyleSheets()
        const styledComponentsSheet = new ServerStyleSheet()

        try {
            ctx.renderPage = () => originalRenderPage({
                enhanceApp: App => props => styledComponentsSheet.collectStyles(materialSheets.collect(
                    <App {...props} />))
            })
            const initialProps = await Document.getInitialProps(ctx)
            return {
                ...initialProps,
                styles: (
                    <React.Fragment>
                        {initialProps.styles}
                        {materialSheets.getStyleElement()}
                        {styledComponentsSheet.getStyleElement()}
                    </React.Fragment>
                )
            }
        } finally {
            styledComponentsSheet.seal()
        }
    }

    render() {
        return (
            <html lang="en" dir="ltr">
            <Head>
                <meta charSet="utf-8"/>
                {/* Use minimum-scale=1 to enable GPU rasterization */}
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
            </html>
        );
    }
}

export default MyDocument;