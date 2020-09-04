import React from "react";
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
        .registerPersistentConfig("md", {
            width: 200,
            collapsible: false,
            autoExpanded: true,
            headerMagnetEnabled: true,
            persistentBehavior: "fit",
        })
        .registerPersistentConfig("xl", {
            width: 420,
            collapsible: false,
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
            "xl",
            {
                width: 420,
                collapsible: false,
                autoExpanded: true,
            })
        .registerPermanentConfig(
            "md",
            {
                width: 300,
                collapsible: false,
                autoExpanded: true,
            })
})

const MessengerLayout: React.FC = (props) => {
    return (
        <Fullscreen>
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