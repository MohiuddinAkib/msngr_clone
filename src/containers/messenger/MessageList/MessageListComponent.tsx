import clsx from "clsx"
import React from "react";
import {FlatList} from "react-native";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import List from "@material-ui/core/List";
import {UserMessage} from "@store/rootReducer";
import Avatar from "@material-ui/core/Avatar";
import {RootState} from "@store/configureStore";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import {FirebaseReducer, isEmpty, isLoaded} from "react-redux-firebase";
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => createStyles({
    msg: {
        backgroundColor: "#EFEFEF",
        borderRadius: theme.spacing(3),
    },
    msgTxt: {
        color: theme.palette.getContrastText("#EFEFEF"),
    },
    myMsg: {
        borderRadius: theme.spacing(3),
        backgroundColor: theme.palette.primary.main,
        "&:first-of-type": {
            borderBottomRightRadius: 0
        },
        "&:last-of-type": {
            borderTopRightRadius: 0
        }
    },
    myMsgTxt: {
        textAlign: "right",
        color: theme.palette.getContrastText(theme.palette.primary.main),
    },
}))

const MessageListComponent: React.FC = (props) => {
    const router = useRouter()
    const classes = useStyles()
    const [messages, setMessages] = React.useState<UserMessage[]>([])
    const auth = useSelector<RootState, FirebaseReducer.AuthState>(state => state.firebase.auth)
    const conversationMessages = useSelector<RootState, { [key: string]: UserMessage }>(state => state.firestore.data[`messages-${router.query.conversation_uid}`])


    React.useEffect(() => {
        if (conversationMessages && isLoaded(conversationMessages) && !isEmpty(conversationMessages)) {
            const newMessages = Object
                .entries(conversationMessages)
                .map(([key, message]) => {
                    return {
                        key,
                        ...message
                    }
                })
            // .reverse()

            setMessages(newMessages)
        }
    }, [conversationMessages])

    return (
        <FlatList<UserMessage>
            data={messages}
            renderItem={({item}) => (
                <ListItem
                    component={"div"}
                    className={clsx(classes.msg, {
                        [classes.myMsg]: item.sender_id === auth.uid
                    })}
                >
                    {item.sender_id !== auth.uid && (
                        <ListItemAvatar>
                            <Avatar
                                src={"https://picsum.photos/200/300"}
                            />
                        </ListItemAvatar>
                    )}

                    <ListItemText
                        secondary={item.message}
                        secondaryTypographyProps={{
                            className: clsx({
                                [classes.myMsgTxt]: item.sender_id === auth.uid
                            })
                        }}
                    />
                </ListItem>
            )}
        />
    );
};

export default MessageListComponent;