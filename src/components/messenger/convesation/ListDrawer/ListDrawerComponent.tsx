import React from "react";
import styled from "styled-components";
import ChatIcon from "@material-ui/icons/Chat";
import Hidden from "@material-ui/core/Hidden";
import {Scrollbars} from "react-custom-scrollbars";
import PeopleIcon from "@material-ui/icons/People";
import {getDrawerSidebar} from "@mui-treasury/layout";
import {MessengerContext} from "@src/context/messenger";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import PeopleListComponent from "@containers/messenger/PeopleList";
import ConversationListComponent from "@containers/messenger/ConversationList";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import ListDrawerHeaderComponent from "@components/messenger/convesation/ListDrawerHeader";

const DrawerSidebar = getDrawerSidebar(styled);

const useStyles = makeStyles(theme => createStyles({
    drawerPaperRoot: {
        [theme.breakpoints.up("lg")]: {
            maxWidth: 420
        },
        [theme.breakpoints.down("sm")]: {
            maxWidth: "100vw"
        }
    },
    title: {
        fontWeight: "bold"
    },
    actionsContainer: {
        textAlign: "right"
    },
}))

const ListDrawerComponent: React.FC = (props) => {
    const classes = useStyles()
    const [view, setView] = React.useState(0)
    const messengerContext = React.useContext(MessengerContext)
    const [trigger, setTrigger] = React.useState(false)

    const handleViewNavigation = (event: React.ChangeEvent, newValue: number) => {
        setView(newValue)
    }

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
            <ListDrawerHeaderComponent
                trigger={trigger}
            />
            <Scrollbars
                universal
                style={{
                    height: "100vh",
                }}
            >
                {view === 0 && <ConversationListComponent/>}
                {view === 1 && <PeopleListComponent/>}
            </Scrollbars>

            <Hidden
                lgUp
            >
                <BottomNavigation
                    value={view}
                    onChange={handleViewNavigation}
                >
                    <BottomNavigationAction
                        label="Chats"
                        icon={<ChatIcon/>}
                    />
                    <BottomNavigationAction
                        label="People"
                        icon={<PeopleIcon/>}
                    />
                </BottomNavigation>
            </Hidden>
        </DrawerSidebar>
    );
};

export default ListDrawerComponent;