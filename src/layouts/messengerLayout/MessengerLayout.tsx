import React from "react";
import Head from "next/head"
import styled from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import Layout, {
    Root,
    getFullscreen,
} from "@mui-treasury/layout";
import MessageListComponent from "@containers/messengerLayout/messageList";
import InfoListDrawerComponent from "@components/messengerLayout/infoListDrawer";
import MessengerMainHeaderComponent from "@components/messengerLayout/messengerMainHeader";
import ConversationListDrawerComponent from "@components/messengerLayout/conversationListDrawer";
import MessengerLayoutContentComponent from "@components/messengerLayout/messengerLayoutContent";

const scheme = Layout();
const Fullscreen = getFullscreen(styled)

scheme.configureHeader(builder => {
    builder
        .registerConfig("xs", {
            initialHeight: 64,
            position: "absolute",
            clipped: false
        })

    builder
        .registerConfig("md", {
            initialHeight: 64,
            position: "absolute",
        })
})

scheme.configureEdgeSidebar(builder => {
    builder
        .create("right_sidebar", {anchor: "right"})
        .registerPersistentConfig("md", {
            width: 200,
            collapsible: true,
            autoExpanded: true,
            headerMagnetEnabled: true,
            persistentBehavior: "fit",
        })
        .registerPersistentConfig("md", {
            width: "30vw",
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
    return (
        <Fullscreen>
            <Head>
                <title>Messenger</title>
            </Head>

            <Root scheme={scheme}>
                <CssBaseline/>
                <MessengerMainHeaderComponent/>
                <ConversationListDrawerComponent/>
                <MessengerLayoutContentComponent>
                    <MessageListComponent/>
                </MessengerLayoutContentComponent>
                <InfoListDrawerComponent/>
            </Root>
        </Fullscreen>
    );
};

export default MessengerLayout;