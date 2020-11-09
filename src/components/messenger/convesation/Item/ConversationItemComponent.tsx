import React from "react";
import moment from "moment"
import {useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import {COLLECTIONS} from "@config/firebase";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton"
import {RootState} from "@store/configureStore";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {MessengerContext} from "@src/context/messenger";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import ListItemText from "@material-ui/core/ListItemText";
import {Conversation, UserMessage} from "@store/rootReducer";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {FirebaseReducer, isEmpty, isLoaded} from "react-redux-firebase";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

interface Props {
    conversationId: string;
    conversation: Conversation;
}

const useStyles = makeStyles((theme) => createStyles({
    skeleton: {},
    avatar: {
        height: 50,
        width: 50
    }
}))

const ConversationItemComponent: React.FC<Props> = (props) => {
    const classes = useStyles()
    const messengerContext = React.useContext(MessengerContext)
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
    const users = useSelector<RootState, { [key: string]: { first_name: string; last_name: string } }>(state => state.firestore.data.users)
    const lastMsgObject = useSelector<RootState, { [key: string]: UserMessage }>(state => state.firestore.data[`last-message-${props.conversationId}`])
    const participants = useSelector<RootState, { [key: string]: { nickname: string; role: string } }>(state => state.firestore.data[`${COLLECTIONS.participants}-${props.conversationId}`])

    React.useEffect(() => {
        if (participants && isLoaded(participants) && !isEmpty(participants)) {
            const [[participantId, otherUser]] = Object
                .entries(participants)
                .filter(([participantId, participantInfo]) => participantId !== auth.uid)

            setOtherParticipant(otherUser)

            if (!otherUser.nickname) {
                const otherUser = users[participantId];

                setOtherParticipant(prevState => ({
                    ...prevState,
                    nickname: `${otherUser.first_name} ${otherUser.last_name}`
                }))
            }
        }
    }, [participants])


    const showMessages = () => {
        messengerContext.selectConversation(props.conversationId)
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
            divider
            onClick={showMessages}
            selected={messengerContext.selectedConvId === props.conversationId}
        >

            {!isLoaded(lastMsgObject) || !isLoaded(participants) ?
                <Box
                    width={"100%"}
                    display={"flex"}
                >
                    <Box
                        mr={1}
                    >
                        <Skeleton
                            variant="circle"
                        >
                            <Avatar
                                className={classes.avatar}
                            />
                        </Skeleton>
                    </Box>

                    <Box
                        flex={1}
                    >
                        <Skeleton width={"85%"}>
                            <Typography>.</Typography>
                        </Skeleton>

                        <Skeleton width={"50%"}>
                            <Typography>.</Typography>
                        </Skeleton>
                    </Box>
                </Box>
                :
                (<>
                    <ListItemAvatar>
                        <Box
                            mr={2}
                        >
                            <Avatar
                                alt={"john doe"}
                                className={classes.avatar}
                                src={"https://picsum.photos/200/300?random=1"}
                            />
                        </Box>
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
                </>)}
        </ListItem>
    );
};

export default ConversationItemComponent;
