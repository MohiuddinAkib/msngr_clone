import React from "react";
import styled from "styled-components";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {getDrawerSidebar, getSidebarContent} from "@mui-treasury/layout";
import ConversationListDrawerHeaderComponent from "./conversationListDrawerHeader";
import ConversationListComponent from "@containers/messengerLayout/conversationList";

const DrawerSidebar = getDrawerSidebar(styled);
const SidebarContent = getSidebarContent(styled)

const useStyles = makeStyles(theme => createStyles({
    title: {
        fontWeight: "bold"
    },
    actionsContainer: {
        textAlign: "right"
    }
}))

const ConversationListDrawerComponent: React.FC = (props) => {
    const classes = useStyles()

    return (
        <DrawerSidebar sidebarId={"left_sidebar"}>
            <ConversationListDrawerHeaderComponent/>
            <SidebarContent>
                <ConversationListComponent/>
            </SidebarContent>
        </DrawerSidebar>
    );
};

export default ConversationListDrawerComponent;