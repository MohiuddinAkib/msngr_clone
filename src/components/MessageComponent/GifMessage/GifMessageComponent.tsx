import clsx from "clsx";
import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import IGif from "@giphy/js-types/dist/gif";
import { Gif } from "@giphy/react-components";
import ReplyIcon from "@material-ui/icons/Reply";
import IconButton from "@material-ui/core/IconButton";
import CardContent from "@material-ui/core/CardContent";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    gifWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      flexDirection: "row-reverse",
      "&:hover $msgActionOptionsContainer": {
        opacity: 1,
        pointerEvents: "all",
      },
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
  messageContent: IGif;
}

const GifMessageComponent: React.FC<IProps> = (props) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.gifWrapper, {
        [classes.myGifWrapper]: props.isMyMessage,
      })}
    >
      <Grid
        item
        container
        direction={props.isMyMessage ? "row" : "row-reverse"}
        className={clsx(classes.msgActionOptionsContainer, {
          [classes.myMsgActionOptionsContainer]: props.isMyMessage,
        })}
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
          <Card className={classes.gifContainer}>
            <CardContent>
              <Gif
                noLink
                width={250}
                className={classes.gifMessage}
                gif={props.messageContent as IGif}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </div>
  );
};

GifMessageComponent.defaultProps = {
  isMyMessage: false,
};

export default GifMessageComponent;
