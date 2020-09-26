import clsx from "clsx"
import React from "react";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import List from "@material-ui/core/List";
import {FlatList, View, StyleSheet} from "react-native";
import {UserMessage} from "@store/rootReducer";
import Avatar from "@material-ui/core/Avatar";
import {RootState} from "@store/configureStore";
import ListItem from "@material-ui/core/ListItem";
import blueGrey from "@material-ui/core/colors/blueGrey"
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {FirebaseReducer, isEmpty, isLoaded} from "react-redux-firebase";

const useStyles = makeStyles(theme => createStyles({
    msg: {
        backgroundColor: blueGrey["50"],
        borderRadius: theme.spacing(3),
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        "&:first-of-type": {
            borderTopLeftRadius: theme.spacing(3)

        },
        "&:last-of-type": {
            borderBottomLeftRadius: theme.spacing(3)
        }
    },
    msgTxt: {
        color: theme.palette.getContrastText(blueGrey["50"]),
    },
    myMsg: {
        borderRadius: theme.spacing(3),
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        backgroundColor: theme.palette.primary.main,
        "&:first-of-type": {
            borderTopRightRadius: theme.spacing(3)

        },
        "&:last-of-type": {
            borderBottomRightRadius: theme.spacing(3)
        }
    },
    myMsgTxt: {
        textAlign: "right",
        color: theme.palette.getContrastText(theme.palette.primary.main),
    },
    smallAvatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    }
}))

const styles = StyleSheet.create({
    otherchat: {}
})

const MessageListComponent: React.FC = (props) => {
    const router = useRouter()
    const classes = useStyles()
    const [messages, setMessages] = React.useState<{ key: string; messages: UserMessage[] }[]>([])
    const auth = useSelector<RootState, FirebaseReducer.AuthState>(state => state.firebase.auth)
    const conversationMessages = useSelector<RootState, { [key: string]: UserMessage }>(state => state.firestore.data[`messages-${router.query.conversation_uid}`])


    React.useEffect(() => {
        if (conversationMessages && isLoaded(conversationMessages) && !isEmpty(conversationMessages)) {

            const formattedMessages: { key: string; messages: UserMessage[] }[] = [];
            let matched = 0;
            let counter = 0;
            let last_index = 0;
            let last_sender = '';

            for (const key in conversationMessages) {
                const currentConversationMessage = conversationMessages[key]
                if (currentConversationMessage.sender_id === last_sender) {
                    formattedMessages[last_index - matched].messages.push(currentConversationMessage)
                    matched++;
                } else {
                    formattedMessages.push({key, messages: [currentConversationMessage]})
                }

                last_index = counter;
                last_sender = currentConversationMessage.sender_id
                counter++;
            }

            setMessages(formattedMessages)
        }
    }, [conversationMessages])

    return (
        <FlatList
            data={messages}
            renderItem={({item}) => (
                <View
                    style={item.messages[0].sender_id !== auth.uid && styles.otherchat}
                >
                    {item.messages[0].sender_id !== auth.uid && (
                        <Avatar
                            className={classes.smallAvatar}
                            src={"https://picsum.photos/200/300"}
                        />
                    )}
                    <List>
                        {item.messages.map(eachMessageItem => (
                            <ListItem
                                divider
                                component={"div"}
                                key={eachMessageItem.created_at}
                                className={clsx(classes.msg, {
                                    [classes.myMsg]: eachMessageItem.sender_id === auth.uid
                                })}
                            >
                                <ListItemText
                                    primary={eachMessageItem.message}
                                    primaryTypographyProps={{
                                        className: clsx({
                                            [classes.myMsgTxt]: eachMessageItem.sender_id === auth.uid
                                        })
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </View>
            )}
        />
    );
};

export default MessageListComponent;