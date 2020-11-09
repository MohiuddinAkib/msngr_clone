import React from "react";
import Head from "next/head"
import styled from "styled-components";
import {SafeAreaView} from "react-native";
import CssBaseline from "@material-ui/core/CssBaseline";
import {MessengerContext} from "@src/context/messenger/messenger";
import Layout, {Root, getFullscreen} from "@mui-treasury/layout";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";

const scheme = Layout();
const Fullscreen = getFullscreen(styled)
scheme.configureHeader(builder => {
    builder
        .registerConfig("xs", {
            position: "relative",
            clipped: false
        })

    builder
        .registerConfig("md", {
            initialHeight: 64,
            position: "relative",
        })
})


scheme.configureEdgeSidebar(builder => {
    builder
        .create("right_sidebar", {anchor: "right"})
        .registerTemporaryConfig("xs", {
            width: "100vw",
        });
})

scheme.configureEdgeSidebar(builder => {
    builder
        .create("right_sidebar", {anchor: "right"})
        .registerPersistentConfig("md", {
            width: 300,
            collapsible: true,
            autoExpanded: true,
            headerMagnetEnabled: true,
            persistentBehavior: "fit",
        })
        .registerPersistentConfig("lg", {
            width: 360,
            collapsible: true,
            autoExpanded: true,
            headerMagnetEnabled: true,
            persistentBehavior: "fit",
        })
        .registerPersistentConfig("xl", {
            width: 420,
            collapsible: true,
            autoExpanded: true,
            headerMagnetEnabled: true,
            persistentBehavior: "fit",
        })


    builder
        .create(
            "left_sidebar",
            {
                anchor: "left",
            })
        .registerTemporaryConfig(
            "xs",
            {
                width: "100vw",
            })
        .registerPermanentConfig(
            "md",
            {
                width: 300,
                collapsible: false,
                autoExpanded: true,
            })
        .registerPermanentConfig(
            "lg",
            {
                width: "25vw",
                collapsible: false,
                autoExpanded: true,
            })
        .registerPermanentConfig(
            "xl",
            {
                width: 420,
                collapsible: false,
                autoExpanded: true,
            })

})


const MessengerLayout: React.FC = (props) => {
    const messengerContext = React.useContext(MessengerContext)

    const customTheme = React.useMemo(() =>
            responsiveFontSizes(createMuiTheme({
                palette: {
                    type: messengerContext.darkMode ? "dark" : "light"
                }
            }))
        ,
        [messengerContext.darkMode])

    return (
        <SafeAreaView>
            <Fullscreen>
                <Head>
                    <title>Messenger</title>
                </Head>

                <Root
                    scheme={scheme}
                    theme={customTheme}
                >
                    <CssBaseline/>
                    {props.children}
                </Root>
            </Fullscreen>
        </SafeAreaView>
    );
};

export default MessengerLayout;
