import React from "react"
import {useRouter} from "next/router";
import Cookies from "universal-cookie";
import {useSelector} from "react-redux";
import {COLLECTIONS} from "@config/firebase";
import {RootState} from "@store/configureStore";
import {Conversation} from "@store/rootReducer";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
    FirebaseReducer,
    isEmpty,
    isLoaded,
    ReduxFirestoreQuerySetting, useFirebase,
    useFirestoreConnect
} from "react-redux-firebase";

export const MessengerContext = React.createContext<any>({})

const MessengerProvider: React.FC = (props) => {
    const theme = useTheme()
    const router = useRouter()
    const firebase = useFirebase()
    const pc = useMediaQuery(theme.breakpoints.up("md"))
    const [darkMode, setDarkMode] = React.useState(false)
    const auth = useSelector<RootState, FirebaseReducer.AuthState>(state => state.firebase.auth)
    const conversations = useSelector<RootState, { [key: string]: Conversation }>(state => state.firestore.data[COLLECTIONS.conversations])
    const [queries, setQueries] = React.useState<ReduxFirestoreQuerySetting[]>([{
        collection: COLLECTIONS.conversations,
        where: [COLLECTIONS.participants, "array-contains", auth.uid],
    }])

    useFirestoreConnect(queries)

    const toggleDarkMode = () => {
        setDarkMode(prevDarkMode => !prevDarkMode)
    }

    React.useEffect(() => {
        if (isLoaded(conversations) && !isEmpty(conversations)) {
            const messageQueriesToAppend: ReduxFirestoreQuerySetting[] = Object.keys(conversations).map(key => {
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

            const participantQueriesToAppend: ReduxFirestoreQuerySetting[] = Object.keys(conversations).map(key => {
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
            setQueries(prevQueries => prevQueries.concat(messageQueriesToAppend, participantQueriesToAppend))
        }
    }, [conversations])

    React.useEffect(() => {
        const cookies = new Cookies();
        return firebase.auth().onIdTokenChanged(async user => {
            if (!user) {
                cookies.set("auth", "")
                return;
            }

            const token = await user.getIdToken()
            cookies.set("auth", token)
        })
    }, [])


    return (
        <MessengerContext.Provider
            value={{
                darkMode,
                toggleDarkMode,
            }}
        >
            {props.children}
        </MessengerContext.Provider>
    );
};

export default MessengerProvider;