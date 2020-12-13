import clsx from "clsx";
import React from "react";
import Grid from "@material-ui/core/Grid";
import ReplyIcon from "@material-ui/icons/Reply";
import IconButton from "@material-ui/core/IconButton";
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
    fileContainer: {
      marginBottom: theme.spacing(2),
    },
    file: {
      maxWidth: "50vw",
      borderRadius: theme.shape.borderRadius * 2,
    },
  })
);

interface IProps {
  fileUrl: string;
  fileAlt?: string;
  isMyMessage?: boolean;
  fileType: "image/jpeg" | "video/webm;codecs=vp8" | "audio/webm;codecs=opus";
}

const FileMessageComponent: React.FC<IProps> = (props) => {
  const classes = useStyles();

  const hasImageFile = React.useMemo(() => {
    return props.fileType === "image/jpeg";
  }, [props.fileType]);

  const hasAudioFile = React.useMemo(() => {
    return props.fileType === "audio/webm;codecs=opus";
  }, [props.fileType]);

  const hasVideoFile = React.useMemo(() => {
    return props.fileType === "video/webm;codecs=vp8";
  }, [props.fileType]);

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

      <div className={classes.fileContainer}>
        {hasImageFile && (
          <img
            src={props.fileUrl}
            alt={props.fileAlt!}
            className={classes.file}
          />
        )}

        {hasVideoFile && (
          <video controls src={props.fileUrl} className={classes.file} />
        )}

        {hasAudioFile && (
          <audio controls src={props.fileUrl} className={classes.file} />
        )}
      </div>
    </div>
  );
};

FileMessageComponent.defaultProps = {
  fileAlt: "",
  isMyMessage: false,
};

export default FileMessageComponent;
