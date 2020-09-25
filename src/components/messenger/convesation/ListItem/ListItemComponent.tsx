import React from "react";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import {RootState} from "@store/configureStore";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import ListItemText from "@material-ui/core/ListItemText";
import {Conversation, UserMessage} from "@store/rootReducer";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {isEmpty, isLoaded, useFirestoreConnect} from "react-redux-firebase";
import {COLLECTIONS} from "@config/firebase";

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
    })
    const lastMsgObject = useSelector<RootState, { [key: string]: UserMessage }>(state => state.firestore.data[`last-message-${props.conversationId}`])

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


    const showMessages = () => {
        router.push(`/messages/${props.conversationId}`)
    }

    React.useEffect(() => {
        if (lastMsgObject && isLoaded(lastMsgObject) && !isEmpty(lastMsgObject)) {
            const [latestMsg] = Object.values(lastMsgObject)

            if (latestMsg) {
                setLastMsg(latestMsg)
            }
        }
    }, [lastMsgObject])


    return (
        <ListItem
            button
            selected={false}
            onClick={showMessages}
        >
            <ListItemAvatar>
                <Avatar
                    alt={"john doe"}
                    src={"https://picsum.photos/200/300?random=1"}
                />
            </ListItemAvatar>
            <ListItemText
                primary={props.conversation.type === "group" ? props.conversation.title : "Other user"}
                secondary={
                    <>
                        <Typography
                            variant="body2"
                            component="span"
                            color="textPrimary"
                        >
                            {lastMsg.message}
                        </Typography>
                        {" — 17.12"}
                    </>
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