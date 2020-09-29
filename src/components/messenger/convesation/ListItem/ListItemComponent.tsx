import React from "react";
import moment from "moment"
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {COLLECTIONS} from "@config/firebase";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton"
import {RootState} from "@store/configureStore";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import {Conversation, UserMessage} from "@store/rootReducer";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {FirebaseReducer, isEmpty, isLoaded, useFirestoreConnect} from "react-redux-firebase";

interface Props {
    conversationId: string;
    conversation: Conversation;
}

const ListItemComponent: React.FC<Props> = (props) => {
    const router = useRouter()
    const [lastMsg, setLastMsg] = React.useState<UserMessage>({
        message: "",
        type: "",
        sender_id: "",
        created_at: ""
    } as any)

    const [otherParticipant, setOtherParticipant] = React.useState<{ nickname: string; role: string }>({
        nickname: "",
        role: ""
    })

    const auth = useSelector<RootState, FirebaseReducer.AuthState>(state => state.firebase.auth)
    const lastMsgObject = useSelector<RootState, { [key: string]: UserMessage }>(state => state.firestore.data[`last-message-${props.conversationId}`])
    const participants = useSelector<RootState, { [key: string]: { nickname: string; role: string } }>(state => state.firestore.data[`${COLLECTIONS.participants}-${props.conversationId}`])

    useFirestoreConnect([
        {
            collection: COLLECTIONS.conversations,
            doc: props.conversationId,
            storeAs: `last-message-${props.conversationId}`,
            subcollections: [
                {
                    collection: COLLECTIONS.messages,
                    orderBy: ["created_at", "desc"],
                    limit: 1
                }
            ]
        }
    ])

    React.useEffect(() => {
        if (participants && isLoaded(participants) && !isEmpty(participants)) {
            const [[, otherUser]] = Object
                .entries(participants)
                .filter(([participantId, participantInfo]) => participantId !== auth.uid)

            setOtherParticipant(otherUser)
        }
    }, [participants])


    const showMessages = () => {
        if (router.query.conversation_uid !== props.conversationId) {
            router.push(`/messages/${props.conversationId}`)
        }
    }

    React.useEffect(() => {
        if (lastMsgObject && isLoaded(lastMsgObject) && !isEmpty(lastMsgObject)) {
            const [latestMsg] = Object.values(lastMsgObject)

            if (latestMsg) {
                setLastMsg(latestMsg)
            }
        }
    }, [lastMsgObject])


    return !isLoaded(lastMsgObject) || !isLoaded(participants) ?
        <Skeleton variant="rect" width={"100%"} height={70}/>
        : (
            <ListItem
                button
                selected={router.query.conversation_uid === props.conversationId}
                onClick={showMessages}
            >
                <ListItemAvatar>
                    <Avatar
                        alt={"john doe"}
                        src={"https://picsum.photos/200/300?random=1"}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={props.conversation.type === "group" ? props.conversation.title : otherParticipant.nickname}
                    secondary={
                        !isEmpty(lastMsgObject) && (
                            <>
                                <Typography
                                    variant="body2"
                                    component="span"
                                    color="textPrimary"
                                >
                                    {lastMsg.type === "text" ? lastMsg.message : `You sent a ${lastMsg.type === "gif" ? "Gif" : "File"}`}
                                </Typography>
                                {` - ${moment(lastMsg.created_at).calendar({
                                    sameDay: "h:mm",
                                    lastDay: "[Yesterday]",
                                    lastWeek: "[Last] dddd",
                                    sameElse: "DD MMM"
                                })}`}
                            </>
                        )
                    }
                />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="options">
                        <MoreHorizIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
};

export default ListItemComponent;