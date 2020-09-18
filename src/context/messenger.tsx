import React from "react"
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export const MessengerContext = React.createContext<any>({})

const MessengerProvider: React.FC = (props) => {
    const theme = useTheme()
    const pc = useMediaQuery(theme.breakpoints.up("lg"))

    const [darkMode, setDarkMode] = React.useState(false)
    const [mountContent, setMountContent] = React.useState(false)
    const [mountMainHeader, setMountMainHeader] = React.useState(false)
    const [mountInfoListDrawer, setMountInfoListDrawer] = React.useState(false)
    const [mountConversationListDrawer, setMountConversationListDrawer] = React.useState(true)

    React.useEffect(() => {
        if (pc) {
            setMountContent(true)
            setMountMainHeader(true)
            setMountInfoListDrawer(true)
            setMountConversationListDrawer(true)
        }

        return () => {
            setMountContent(false)
            setMountMainHeader(false)
            setMountInfoListDrawer(false)
            setMountConversationListDrawer(false)
        }
    }, [pc])

    const toggleDarkMode = () => {
        setDarkMode(prevDarkMode => !prevDarkMode)
    }

    const handleMessageComponentsVisibility = () => {
        if (!pc) {
            setMountContent(prevState => !prevState)
            setMountMainHeader(prevState => !prevState)
            setMountInfoListDrawer(prevState => !prevState)
            setMountConversationListDrawer(prevState => !prevState)
        }
    }

    return (
        <MessengerContext.Provider
            value={{
                darkMode,
                mountContent,
                toggleDarkMode,
                mountMainHeader,
                mountInfoListDrawer,
                mountConversationListDrawer,
                handleMessageComponentsVisibility,
            }}
        >
            {props.children}
        </MessengerContext.Provider>
    );
};

export default MessengerProvider;