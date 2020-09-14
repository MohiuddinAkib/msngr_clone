import React from "react";
import styled from "styled-components";
import {Scrollbars} from "react-custom-scrollbars";
import {getDrawerSidebar} from "@mui-treasury/layout";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import ConversationListDrawerHeaderComponent from "./conversationListDrawerHeader";
import ConversationListComponent from "@containers/messengerLayout/conversationList";

const DrawerSidebar = getDrawerSidebar(styled);

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
    },
    sidebarContent: {
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
            display: "none"
        }
    }
}))

const ConversationListDrawerComponent: React.FC = (props) => {
    const classes = useStyles()
    const [trigger, setTrigger] = React.useState(false)

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

            <Scrollbars
                universal
                style={{
                    height: "100vh",
                }}
            >
                <ConversationListComponent/>
            </Scrollbars>
        </DrawerSidebar>
    );
};

export default ConversationListDrawerComponent;