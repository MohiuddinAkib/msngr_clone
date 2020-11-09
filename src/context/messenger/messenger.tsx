import React from "react"
import Cookies from "universal-cookie";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {COLLECTIONS} from "@config/firebase";
import {RootState} from "@store/configureStore";
import {Conversation, Profile} from "@store/rootReducer";
import {
    isEmpty,
    isLoaded,
    useFirebase,
    FirebaseReducer,
    useFirestoreConnect,
    ReduxFirestoreQuerySetting,
} from "react-redux-firebase";
import {useErrorHandler} from "react-error-boundary";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export const MessengerContext = React.createContext<any>({})

const MessengerProvider: React.FC = (props) => {
    const theme = useTheme()
    const router = useRouter()
    const cookies = new Cookies()
    const firebase = useFirebase()
    const handleError = useErrorHandler()
    const mobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [darkMode, setDarkMode] = React.useState(false)
    // Profile related starts
    const [profile, setProfile] = React.useState<Profile>({
        first_name: "",
        last_name: ""
    })
    const [profileLoading, setProfileLoading] = React.useState(true)
    const [openProfileMenu, setOpenProfileMenu] = React.useState(false)
    // Profile related ends

    // Conversations related starts
    const [selectedConvId, setSelectedConvId] = React.useState("")
    const [conversationsLoading, setConversationsLoading] = React.useState(true)
    const [conversations, setConversations] = React.useState<{ [key: string]: Conversation }>({})
    // Conversations related ends

    const [queries, setQueries] = React.useState<ReduxFirestoreQuerySetting[]>([])
    const auth = useSelector<RootState, FirebaseReducer.AuthState>(state => state.firebase.auth)
    const reduxProfile = useSelector<RootState, FirebaseReducer.Profile<Profile>>(state => state.firebase.profile)
    const reduxConversations = useSelector<RootState, { [key: string]: Conversation }>(state => state.firestore.data[COLLECTIONS.conversations])

    useFirestoreConnect(queries)

    useFirestoreConnect({
        collection: COLLECTIONS.users,
    })

    const toggleDarkMode = () => {
        setDarkMode(prevDarkMode => !prevDarkMode)
    }

    const showProfileMenu = () => {
        setOpenProfileMenu(true)
    }

    const hideProfileMenu = () => {
        setOpenProfileMenu(false)
    }

    const selectConversation = (convId: string) => {
        if (convId) {
            setSelectedConvId(convId)

            router.replace(
                '/messages/[conversation_uid]',
                `/messages/${convId}`
            )
        }
    }

    React.useEffect(() => {
        if (router.query.conversation_uid) {
            setSelectedConvId(router.query.conversation_uid as string)
        }
    }, [router.query.conversation_uid])

    React.useEffect(() => {
        if (isLoaded(reduxProfile) && !isEmpty(reduxProfile)) {
            setProfile(reduxProfile)
            setProfileLoading(false)
        }
    }, [reduxProfile])

    React.useEffect(() => {
        if (isLoaded(reduxConversations) && !isEmpty(reduxConversations)) {
            setConversations(reduxConversations)
            setConversationsLoading(false)
        }
    }, [reduxConversations])

    React.useEffect(() => {
        if (isLoaded(auth) && !isEmpty(auth)) {
            setQueries(prevQueries => prevQueries.concat({
                collection: COLLECTIONS.conversations,
                where: [COLLECTIONS.participants, "array-contains", auth.uid],
            }))
        }
    }, [auth])

    React.useEffect(() => {
        if (isLoaded(reduxConversations) && !isEmpty(reduxConversations)) {
            const messageQueriesToAppend: ReduxFirestoreQuerySetting[] = Object.keys(reduxConversations)
                .map(key => {
                    return {
                        doc: key,
                        collection: COLLECTIONS.conversations,
                        storeAs: `messages-${key}`,
                        subcollections: [
                            {
                                collection: COLLECTIONS.messages,
                                orderBy: ["created_at", "asc"],
                            },
                        ],
                    }
                })

            const convsLastMsgQueryToAppend: ReduxFirestoreQuerySetting[] = Object.keys(reduxConversations)
                .map(key => {
                    return {
                        doc: key,
                        collection: COLLECTIONS.conversations,
                        storeAs: `last-message-${key}`,
                        subcollections: [
                            {
                                collection: COLLECTIONS.messages,
                                orderBy: ["created_at", "desc"],
                                limit: 1
                            }
                        ]
                    }
                })

            const participantQueriesToAppend: ReduxFirestoreQuerySetting[] = Object.keys(reduxConversations)
                .map(key => {
                    return {
                        doc: key,
                        collection: COLLECTIONS.conversations,
                        storeAs: `participants-${key}`,
                        subcollections: [
                            {
                                collection: COLLECTIONS.participants,
                            },
                        ],
                    }
                })

            setQueries(prevQueries =>
                prevQueries
                    .concat(
                        messageQueriesToAppend,
                        convsLastMsgQueryToAppend,
                        participantQueriesToAppend,
                    )
            )
        }
    }, [reduxConversations])


    return (
        <MessengerContext.Provider
            value={{
                profile,
                darkMode,
                conversations,
                toggleDarkMode,
                profileLoading,
                openProfileMenu,
                selectedConvId,
                showProfileMenu,
                hideProfileMenu,
                selectConversation,
                conversationsLoading,
            }}
        >
            {props.children}
        </MessengerContext.Provider>
    );
};

export default MessengerProvider;
