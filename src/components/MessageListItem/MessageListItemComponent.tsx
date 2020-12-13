import React from "react";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import MessageComponent from "../MessageComponent/MessageComponent";
import { Message } from "@src/data/domain/Message";
import blueGrey from "@material-ui/core/colors/blueGrey";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
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
        marginBottom: 2,
      },
      "&:first-of-type > div:last-child": {
        borderTopLeftRadius: theme.spacing(3),
      },
      "&:last-of-type > div:last-child": {
        borderBottomLeftRadius: theme.spacing(3),
        marginBottom: 0,
      },
      // "&:hover $msgActionOptionsContainer": {
      //   opacity: 1,
      //   pointerEvents: "all",
      // },
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
        borderTopRightRadius: theme.spacing(3),
      },
      "&:last-of-type > div:last-child": {
        borderBottomRightRadius: theme.spacing(3),
      },
    },
    myMsgTxt: {
      textAlign: "right",
      color: theme.palette.getContrastText(theme.palette.primary.main),
    },
    smallAvatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      marginBottom: theme.spacing(),
      marginRight: theme.spacing(),
    },
  })
);

interface IProps {
  messages: Message[];
  avatarImageUrl?: string;
  position?: "right" | "left";
  type?: "file" | "gif" | "text";
}

const MessageListItemComponent: React.FC<IProps> = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  const right = props.position === "right";

  return (
    <Grid container alignItems={"flex-end"}>
      <Grid item>
        {props.avatarImageUrl && (
          <Avatar className={classes.smallAvatar} src={props.avatarImageUrl} />
        )}
      </Grid>

      <Grid
        item
        style={{
          flex: 1,
          marginLeft: right ? "auto" : 0,
        }}
      >
        <List dense={mobile} component={"div"}>
          {props.messages.map((eachMessage) => (
            <MessageComponent
              message={eachMessage}
              key={eachMessage.created_at}
              isMyMessage={eachMessage.isMyMessage}
            />
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

MessageListItemComponent.defaultProps = {
  type: "text",
  position: "left",
  avatarImageUrl: "",
};

export default MessageListItemComponent;
