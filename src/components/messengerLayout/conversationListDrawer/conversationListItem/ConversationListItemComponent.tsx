import React from "react";
import Avatar from '@material-ui/core/Avatar';
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

const ConversationListItemComponent: React.FC = (props) => {
    return (
        <ListItem button selected={false}>
            <ListItemAvatar>
                <Avatar
                    alt={"john doe"}
                    src={"https://picsum.photos/200/300?random=1"}
                />
            </ListItemAvatar>
            <ListItemText
                primary={"Shaneen ara"}
                secondary={
                    <>
                        <Typography
                            variant="body2"
                            component="span"
                            color="textPrimary"
                        >
                            Hello. Kmn acho?
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

export default ConversationListItemComponent;