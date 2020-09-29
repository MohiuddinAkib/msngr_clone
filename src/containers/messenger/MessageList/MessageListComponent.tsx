import clsx from "clsx"
import React from "react";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import ntvEmojiRegex from "emoji-regex";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import {Gif} from "@giphy/react-components";
import IGif from "@giphy/js-types/dist/gif";
import Avatar from "@material-ui/core/Avatar";
import {UserMessage} from "@store/rootReducer";
import Popover from "@material-ui/core/Popover";
import {RootState} from "@store/configureStore";
import ReplyIcon from "@material-ui/icons/Reply";
import ListItem from "@material-ui/core/ListItem";
import allEmojiData from "emoji-mart/data/all.json"
import reactStringReplace from "react-string-replace";
import {Emoji, getEmojiDataFromNative} from "emoji-mart"
import CardContent from "@material-ui/core/CardContent";
import blueGrey from "@material-ui/core/colors/blueGrey"
import IconButton from "@material-ui/core/IconButton";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import useTheme from "@material-ui/core/styles/useTheme";
import ListItemText from "@material-ui/core/ListItemText";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {FlatList, TouchableWithoutFeedback, View} from "react-native";
import {FirebaseReducer, isEmpty, isLoaded} from "react-redux-firebase";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import {bindPopover, bindTrigger, usePopupState} from "material-ui-popup-state/hooks";

const useStyles = makeStyles(theme => createStyles({
    msg: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: "row-reverse",
        "& > div:last-child": {
            width: "auto",
            borderTopLeftRadius: 0,
            display: "inline-block",
            borderBottomLeftRadius: 0,
            borderRadius: theme.spacing(3),
            backgroundColor: blueGrey["50"],
            marginBottom: 2
        },
        "&:first-of-type > div:last-child": {
            borderTopLeftRadius: theme.spacing(3)
        },
        "&:last-of-type > div:last-child": {
            borderBottomLeftRadius: theme.spacing(3),
            marginBottom: 0
        },
        "&:hover $msgActionOptionsContainer": {
            opacity: 1,
            pointerEvents: "all",
        }
    },
    msgTxt: {
        color: theme.palette.getContrastText(blueGrey["50"]),
    },
    myMsg: {
        flexDirection: "row",
        textAlign: "right",
        "& > div:last-child": {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderRadius: theme.spacing(3),
            backgroundColor: theme.palette.primary.main,
        },
        "&:first-of-type > div:last-child": {
            borderTopRightRadius: theme.spacing(3)

        },
        "&:last-of-type > div:last-child": {
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
    gifWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: "row-reverse",
        "&:hover $msgActionOptionsContainer": {
            opacity: 1,
            pointerEvents: "all",
        }
    },
    myGifWrapper: {
        flexDirection: "row",
    },
    gifContainer: {
        marginBottom: theme.spacing(2),
    },
    gifMessage: {},
    msgActionOptionsContainer: {
        opacity: 0,
        width: "auto",
        pointerEvents: "none",
        marginLeft: theme.spacing(2),
        transition: theme.transitions.create(["opacity", "pointer-events"], {
            duration: theme.transitions.duration.complex,
            easing: theme.transitions.easing.easeInOut
        })
    },
    myMsgActionOptionsContainer: {
        marginLeft: 0,
        marginRight: theme.spacing(2),
    },
    fileContainer: {
        marginBottom: theme.spacing(2),
    },
    file: {
        maxWidth: "50vw",
        borderRadius: theme.shape.borderRadius * 2,
    }
}))

const MessageListComponent: React.FC = (props) => {
    const theme = useTheme()
    const router = useRouter()
    const classes = useStyles()
    const reactionPopup = usePopupState({
        variant: "popover",
        popupId: "msg-reaction-popover",
    })
    const mobile = useMediaQuery(theme.breakpoints.down("sm"))
    const auth = useSelector<RootState, FirebaseReducer.AuthState>(state => state.firebase.auth)
    const [messages, setMessages] = React.useState<{ key: string; messages: UserMessage[] }[]>([])
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
        <>
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
                                flex: 1,
                                marginLeft: item.messages[0].sender_id === auth.uid ? "auto" : 0,
                            }}
                        >
                            <List
                                dense={mobile}
                                component={"div"}
                            >
                                {item.messages.map(eachMessageItem => {
                                        if (eachMessageItem.type === "text") {
                                            const ntvRegex = ntvEmojiRegex();
                                            const emojis = [];
                                            let match;
                                            while (match = ntvRegex.exec(eachMessageItem.message as string)) {
                                                const [emoji] = match;
                                                emojis.push(emoji)
                                            }

                                            const regex2 = emojis.join("|")

                                            const res = !emojis.length
                                                ?
                                                eachMessageItem.message
                                                :
                                                reactStringReplace((eachMessageItem.message as string), regex2,
                                                    (match, i) => {
                                                        const emojiData = getEmojiDataFromNative(match, "facebook", allEmojiData as any)

                                                        return <Emoji
                                                            native
                                                            key={i}
                                                            size={16}
                                                            set={"facebook"}
                                                            emoji={emojiData}
                                                            skin={emojiData.skin || 1}
                                                        />
                                                    })

                                            return (
                                                <div
                                                    key={eachMessageItem.created_at}
                                                    className={clsx(classes.msg, {
                                                        [classes.myMsg]: eachMessageItem.sender_id === auth.uid
                                                    })}
                                                >
                                                    <Grid
                                                        item
                                                        container
                                                        style={{
                                                            width: "auto"
                                                        }}
                                                        className={clsx(classes.msgActionOptionsContainer, {
                                                            [classes.myMsgActionOptionsContainer]: eachMessageItem.sender_id === auth.uid
                                                        })}
                                                        direction={eachMessageItem.sender_id === auth.uid ? "row" : "row-reverse"}
                                                    >
                                                        <Grid
                                                            item
                                                        >
                                                            <IconButton
                                                                size={"small"}
                                                            >
                                                                <MoreHorizIcon
                                                                    fontSize={"small"}
                                                                />
                                                            </IconButton>
                                                        </Grid>

                                                        <Grid
                                                            item
                                                        >
                                                            <IconButton
                                                                size={"small"}
                                                            >
                                                                <ReplyIcon
                                                                    fontSize={"small"}
                                                                />
                                                            </IconButton>
                                                        </Grid>

                                                        <Grid
                                                            item
                                                        >
                                                            <IconButton
                                                                size={"small"}
                                                                {...bindTrigger(reactionPopup)}
                                                            >
                                                                <SentimentVerySatisfiedIcon
                                                                    fontSize={"small"}
                                                                />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>

                                                    <TouchableWithoutFeedback
                                                        onLongPress={(event) => {
                                                            console.log("heii")
                                                        }}
                                                    >
                                                        <View>
                                                            <ListItem
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
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                </div>
                                            )
                                        }

                                        if (eachMessageItem.type === "gif") {
                                            return (
                                                <div
                                                    key={eachMessageItem.created_at}
                                                    className={clsx(classes.gifWrapper, {
                                                        [classes.myGifWrapper]: eachMessageItem.sender_id === auth.uid
                                                    })}
                                                >
                                                    <Grid
                                                        item
                                                        container
                                                        className={clsx(classes.msgActionOptionsContainer, {
                                                            [classes.myMsgActionOptionsContainer]: eachMessageItem.sender_id === auth.uid
                                                        })}
                                                        direction={eachMessageItem.sender_id === auth.uid ? "row" : "row-reverse"}
                                                    >
                                                        <Grid
                                                            item
                                                        >
                                                            <IconButton
                                                                size={"small"}
                                                            >
                                                                <MoreHorizIcon
                                                                    fontSize={"small"}
                                                                />
                                                            </IconButton>
                                                        </Grid>

                                                        <Grid
                                                            item
                                                        >
                                                            <IconButton
                                                                size={"small"}
                                                            >
                                                                <ReplyIcon
                                                                    fontSize={"small"}
                                                                />
                                                            </IconButton>
                                                        </Grid>

                                                        <Grid
                                                            item
                                                        >
                                                            <IconButton
                                                                size={"small"}
                                                                {...bindTrigger(reactionPopup)}
                                                            >
                                                                <SentimentVerySatisfiedIcon
                                                                    fontSize={"small"}
                                                                />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>

                                                    <TouchableWithoutFeedback
                                                        onLongPress={(event) => {
                                                            console.log("heii")
                                                        }}
                                                    >
                                                        <View>
                                                            <Card
                                                                className={classes.gifContainer}
                                                            >
                                                                <CardContent>
                                                                    <Gif
                                                                        noLink
                                                                        width={250}
                                                                        className={classes.gifMessage}
                                                                        gif={eachMessageItem.message as IGif}
                                                                    />
                                                                </CardContent>
                                                            </Card>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                </div>
                                            )
                                        }

                                        if (eachMessageItem.type === "file") {
                                            return (
                                                <div
                                                    key={eachMessageItem.created_at}
                                                    className={clsx(classes.gifWrapper, {
                                                        [classes.myGifWrapper]: eachMessageItem.sender_id === auth.uid
                                                    })}
                                                >
                                                    <Grid
                                                        item
                                                        container
                                                        className={clsx(classes.msgActionOptionsContainer, {
                                                            [classes.myMsgActionOptionsContainer]: eachMessageItem.sender_id === auth.uid
                                                        })}
                                                        direction={eachMessageItem.sender_id === auth.uid ? "row" : "row-reverse"}
                                                    >
                                                        <Grid
                                                            item
                                                        >
                                                            <IconButton
                                                                size={"small"}
                                                            >
                                                                <MoreHorizIcon
                                                                    fontSize={"small"}
                                                                />
                                                            </IconButton>
                                                        </Grid>

                                                        <Grid
                                                            item
                                                        >
                                                            <IconButton
                                                                size={"small"}
                                                            >
                                                                <ReplyIcon
                                                                    fontSize={"small"}
                                                                />
                                                            </IconButton>
                                                        </Grid>

                                                        <Grid
                                                            item
                                                        >
                                                            <IconButton
                                                                size={"small"}
                                                                {...bindTrigger(reactionPopup)}
                                                            >
                                                                <SentimentVerySatisfiedIcon
                                                                    fontSize={"small"}
                                                                />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>

                                                    <div
                                                        className={classes.fileContainer}
                                                    >
                                                        {eachMessageItem.contentType === "image/jpeg" && (
                                                            <img
                                                                alt={eachMessageItem.name}
                                                                className={classes.file}
                                                                src={eachMessageItem.downloadURL}
                                                            />
                                                        )}

                                                        {eachMessageItem.contentType === "video/webm;codecs=vp8" && (
                                                            <video
                                                                controls
                                                                className={classes.file}
                                                                src={eachMessageItem.downloadURL}
                                                            />
                                                        )}

                                                        {eachMessageItem.contentType === "audio/webm;codecs=opus" && (
                                                            <audio
                                                                controls
                                                                className={classes.file}
                                                                src={eachMessageItem.downloadURL}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    }
                                )}
                            </List>
                        </Grid>
                    </Grid>
                )}
            />
            <Popover
                {...bindPopover(reactionPopup)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                This is popover content
            </Popover>
        </>
    );
};

export default MessageListComponent;