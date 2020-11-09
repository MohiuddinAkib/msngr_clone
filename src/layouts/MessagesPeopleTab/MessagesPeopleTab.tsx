import React from "react"
import propTypes from "prop-types"
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {COLLECTIONS} from "@config/firebase";
import Hidden from "@material-ui/core/Hidden";
import ChatIcon from "@material-ui/icons/Chat";
import {RootState} from "@store/configureStore";
import {Conversation} from "@store/rootReducer";
import {Scrollbars} from "react-custom-scrollbars";
import PeopleIcon from "@material-ui/icons/People";
import MessengerLayout from "@layouts/MessengerLayout";
import {isEmpty, isLoaded} from "react-redux-firebase";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import {NativeScrollEvent, NativeSyntheticEvent, ScrollView} from "react-native";
import ListDrawerHeaderComponent from "@components/messenger/convesation/ListDrawerHeader";

const MessagesPeopleTab: React.FC<{ initialView?: number }> = (props) => {
    const theme = useTheme()
    const router = useRouter()
    const [view, setView] = React.useState(props.initialView)
    const pc = useMediaQuery(theme.breakpoints.up("md"))
    const [trigger, setTrigger] = React.useState(false)
    const conversations = useSelector<RootState, { [key: string]: Conversation }>(state => state.firestore.data[COLLECTIONS.conversations])

    const handleNativeScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        setTrigger(event.nativeEvent.contentOffset.y > 1 ? true : false)
    }

    const handleViewNavigation = (event: React.ChangeEvent, newValue: number) => {
        setView(newValue)
    }

    React.useEffect(() => {
        if (view === 0) {
            router.replace({
                    pathname: "/messages"
                },
                "messages")
        }

        if (view === 1) {
            router.replace({
                    pathname: "/people",
                },
                "people"
            )
        }
    }, [view])

    React.useEffect(() => {
        if (pc && isLoaded(conversations) && !isEmpty(conversations)) {
            const conversationId = Object.keys(conversations)[0]

            router.replace(
                '/messages/[conversation_uid]',
                `/messages/${conversationId}`
            )
        }
    }, [pc, conversations])

    return !pc && (
        <ScrollView
            scrollEventThrottle={0}
            onScroll={handleNativeScroll}
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
                {props.children}
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
        </ScrollView>
    );
};

MessagesPeopleTab.defaultProps = {
    initialView: 0
}

MessagesPeopleTab.propTypes = {
    initialView: propTypes.number
}

export default MessagesPeopleTab;
