import React from "react"
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import Hidden from "@material-ui/core/Hidden";
import {COLLECTIONS} from "@config/firebase";
import ChatIcon from "@material-ui/icons/Chat";
import {RootState} from "@store/configureStore";
import {isEmpty, isLoaded} from "react-redux-firebase";
import withAuth from "@components/auth/withAuth";
import {Conversation} from "@store/rootReducer";
import {Scrollbars} from "react-custom-scrollbars";
import PeopleIcon from "@material-ui/icons/People";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import PeopleListComponent from "@containers/messenger/PeopleList";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import ConversationListComponent from "@containers/messenger/ConversationList";
import {NativeScrollEvent, NativeSyntheticEvent, ScrollView} from "react-native";
import ListDrawerHeaderComponent from "@components/messenger/convesation/ListDrawerHeader";
import MessengerProvider, {MessengerContext} from "@src/context/messenger";

const Index: NextPage = (props) => {
    const theme = useTheme()
    const router = useRouter()
    const [view, setView] = React.useState(0)
    const pc = useMediaQuery(theme.breakpoints.up("md"))
    const messengerContext = React.useContext(MessengerContext)
    const [trigger, setTrigger] = React.useState(false)
    const conversations = useSelector<RootState, { [key: string]: Conversation }>(state => state.firestore.data[COLLECTIONS.conversations])

    const handleNativeScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        setTrigger(event.nativeEvent.contentOffset.y > 1 ? true : false)
    }

    const handleViewNavigation = (event: React.ChangeEvent, newValue: number) => {
        setView(newValue)
    }

    React.useEffect(() => {
        if (pc && isLoaded(conversations) && !isEmpty(conversations)) {
            const conversationId = Object.keys(conversations)[0]
            router.replace(`/messages/${conversationId}`)
        }
    }, [pc, conversations])

    return (
        <MessengerProvider>
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
            </ScrollView>
        </MessengerProvider>
    );
};

export default withAuth(Index);