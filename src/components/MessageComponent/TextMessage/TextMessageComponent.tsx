import clsx from "clsx";
import React from "react";
import { Emoji } from "emoji-mart";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import IGif from "@giphy/js-types/dist/gif";
import { Gif } from "@giphy/react-components";
import Avatar from "@material-ui/core/Avatar";
import ReplyIcon from "@material-ui/icons/Reply";
import ListItem from "@material-ui/core/ListItem";
import { Message } from "@src/data/domain/Message";
import IconButton from "@material-ui/core/IconButton";
import CardContent from "@material-ui/core/CardContent";
import blueGrey from "@material-ui/core/colors/blueGrey";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ListItemText from "@material-ui/core/ListItemText";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import GifMessage from "../GifMessage/GifMessageComponent";
import FileMessage from "../FileMessage/FileMessageComponent";

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
      "&:hover $msgActionOptionsContainer": {
        opacity: 1,
        pointerEvents: "all",
      },
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
    msgActionOptionsContainer: {
      opacity: 0,
      width: "auto",
      pointerEvents: "none",
      marginLeft: theme.spacing(2),
      transition: theme.transitions.create(["opacity", "pointer-events"], {
        duration: theme.transitions.duration.complex,
        easing: theme.transitions.easing.easeInOut,
      }),
    },
    myMsgActionOptionsContainer: {
      marginLeft: 0,
      marginRight: theme.spacing(2),
    },
  })
);

interface IProps {
  isMyMessage: boolean;
  message: string | React.ReactNodeArray | IGif;
}

const TextMessageComponent: React.FC<IProps> = (props) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.msg, {
        [classes.myMsg]: props.isMyMessage,
      })}
    >
      <Grid
        item
        container
        style={{
          width: "auto",
        }}
        className={clsx(classes.msgActionOptionsContainer, {
          [classes.myMsgActionOptionsContainer]: props.isMyMessage,
        })}
        direction={props.isMyMessage ? "row" : "row-reverse"}
      >
        <Grid item>
          <IconButton size={"small"}>
            <MoreHorizIcon fontSize={"small"} />
          </IconButton>
        </Grid>

        <Grid item>
          <IconButton size={"small"}>
            <ReplyIcon fontSize={"small"} />
          </IconButton>
        </Grid>

        <Grid item>
          {/* <IconButton
                size={"small"}
                {...bindTrigger(reactionPopup)}
              >
                <SentimentVerySatisfiedIcon fontSize={"small"} />
              </IconButton> */}
        </Grid>
      </Grid>

      <Box
        onClick={(event) => {
          console.log("heii");
        }}
      >
        <Box>
          <ListItem component={"div"}>
            <ListItemText
              primary={props.message}
              primaryTypographyProps={{
                className: clsx({
                  [classes.myMsgTxt]: props.isMyMessage,
                }),
              }}
            />
          </ListItem>
        </Box>
      </Box>
    </div>
  );
};

export default TextMessageComponent;
