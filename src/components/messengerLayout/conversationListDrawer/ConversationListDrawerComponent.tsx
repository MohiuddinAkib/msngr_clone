import React from "react";
import styled from "styled-components";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {getDrawerSidebar, getSidebarContent} from "@mui-treasury/layout";
import ConversationListDrawerHeaderComponent from "./conversationListDrawerHeader";
import ConversationListComponent from "@containers/messengerLayout/conversationList";

const DrawerSidebar = getDrawerSidebar(styled);
const SidebarContent = getSidebarContent(styled)

const useStyles = makeStyles(theme => createStyles({
    drawerPaperRoot: {
        minWidth: 300,
        maxWidth: 420
    },
    title: {
        fontWeight: "bold"
    },
    actionsContainer: {
        textAlign: "right"
    }
}))

const ConversationListDrawerComponent: React.FC = (props) => {
    const classes = useStyles()
    const [trigger, setTrigger] = React.useState(undefined)

    const handleDrawerScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const scrollTop = (event.target as HTMLDivElement).scrollTop

        setTrigger(scrollTop > 1 ? true : false)
    }

    return (
        <DrawerSidebar
            sidebarId={"left_sidebar"}
            onScroll={handleDrawerScroll}
            classes={{
                paper: classes.drawerPaperRoot
            }}
        >
            <ConversationListDrawerHeaderComponent trigger={trigger}/>
            <SidebarContent>
                <ConversationListComponent/>
            </SidebarContent>
        </DrawerSidebar>
    );
};

export default ConversationListDrawerComponent;