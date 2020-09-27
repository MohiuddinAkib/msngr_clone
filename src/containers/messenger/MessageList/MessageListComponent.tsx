import clsx from "clsx"
import React from "react";
import {Emoji} from 'emoji-mart'
import emojiRegex from "emoji-regex";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import IGif from "@giphy/js-types/dist/gif";
import {UserMessage} from "@store/rootReducer";
import Avatar from "@material-ui/core/Avatar";
import {RootState} from "@store/configureStore";
import {FlatList, StyleSheet} from "react-native";
import ListItem from "@material-ui/core/ListItem";
import reactStringReplace from "react-string-replace";
import blueGrey from "@material-ui/core/colors/blueGrey"
import useTheme from "@material-ui/core/styles/useTheme";
import ListItemText from "@material-ui/core/ListItemText";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {FirebaseReducer, isEmpty, isLoaded} from "react-redux-firebase";
import {Gif} from "@giphy/react-components";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles(theme => createStyles({
    msg: {
        "& > div": {
            width: "auto",
            borderTopLeftRadius: 0,
            display: "inline-block",
            borderBottomLeftRadius: 0,
            borderRadius: theme.spacing(3),
            backgroundColor: blueGrey["50"],
        },
        "&:first-of-type > div": {
            borderTopLeftRadius: theme.spacing(3)
        },
        "&:last-of-type > div": {
            borderBottomLeftRadius: theme.spacing(3)
        }
    },
    msgTxt: {
        color: theme.palette.getContrastText(blueGrey["50"]),
    },
    myMsg: {
        textAlign: "right",
        "& > div": {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderRadius: theme.spacing(3),
            backgroundColor: theme.palette.primary.main,
        },
        "&:first-of-type > div": {
            borderTopRightRadius: theme.spacing(3)

        },
        "&:last-of-type > div": {
            borderBottomRightRadius: theme.spacing(3)
        }
    },
    myMsgTxt: {
        textAlign: "right",
        color: theme.palette.getContrastText(theme.palette.primary.main),
    },
    smallAvatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        marginBottom: theme.spacing(),
        marginRight: theme.spacing()
    },
    gifContainer: {
        marginBottom: theme.spacing(2)
    },
    gifMessage: {}
}))

const MessageListComponent: React.FC = (props) => {
    const theme = useTheme()
    const router = useRouter()
    const classes = useStyles()
    const mobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [messages, setMessages] = React.useState<{ key: string; messages: UserMessage[] }[]>([])
    const auth = useSelector<RootState, FirebaseReducer.AuthState>(state => state.firebase.auth)
    const conversationMessages = useSelector<RootState, { [key: string]: UserMessage }>(state => state.firestore.data[`messages-${router.query.conversation_uid}`])


    React.useEffect(() => {
        if (conversationMessages && isLoaded(conversationMessages) && !isEmpty(conversationMessages)) {

            const formattedMessages: { key: string; messages: UserMessage[] }[] = [];
            let matched = 0;
            let counter = 0;
            let last_index = 0;
            let last_sender = "";

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
                <Grid
                    container
                    alignItems={"flex-end"}
                >
                    <Grid
                        item
                    >
                        {item.messages[0].sender_id !== auth.uid && (
                            <Avatar
                                className={classes.smallAvatar}
                                src={"https://picsum.photos/200/300"}
                            />
                        )}
                    </Grid>

                    <Grid
                        item
                        style={{
                            marginLeft: item.messages[0].sender_id === auth.uid ? "auto" : 0,
                        }}
                    >
                        <List
                            dense={mobile}
                            component={"div"}
                        >
                            {item.messages.map(eachMessageItem => {
                                if (eachMessageItem.type === "text") {
                                    const regex = emojiRegex();


                                    const res = reactStringReplace(eachMessageItem.message as string, regex.source, (match, i) => {

                                        return <Emoji size={16} emoji={match}/>
                                    })

                                    console.log(res)
                                    return (
                                        <div
                                            key={eachMessageItem.created_at}
                                            className={clsx(classes.msg, {
                                                [classes.myMsg]: eachMessageItem.sender_id === auth.uid
                                            })}
                                        >
                                            <ListItem
                                                divider
                                                component={"div"}
                                            >
                                                <ListItemText
                                                    primary={res}
                                                    primaryTypographyProps={{
                                                        className: clsx({
                                                            [classes.myMsgTxt]: eachMessageItem.sender_id === auth.uid
                                                        })
                                                    }}
                                                />
                                            </ListItem>
                                        </div>
                                    )
                                }

                                if (eachMessageItem.type === "gif") {
                                    return (
                                        <Card
                                            key={eachMessageItem.created_at}
                                            className={classes.gifContainer}
                                        >
                                            <CardContent>
                                                <Gif
                                                    width={250}
                                                    className={classes.gifMessage}
                                                    gif={eachMessageItem.message as IGif}
                                                />
                                            </CardContent>
                                        </Card>
                                    )
                                }
                            }
                            )}
                        </List>
                    </Grid>
                </Grid>
            )}
        />
    );
};

export default MessageListComponent;