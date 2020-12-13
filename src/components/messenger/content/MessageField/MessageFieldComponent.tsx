import React from "react";
import { useRouter } from "next/router";
import Box from "@material-ui/core/Box";
import { useSelector } from "react-redux";
import Fade from "@material-ui/core/Fade";
import GifIcon from "@material-ui/icons/Gif";
import IGif from "@giphy/js-types/dist/gif";
import Drawer from "@material-ui/core/Drawer";
import Popper from "@material-ui/core/Popper";
import Hidden from "@material-ui/core/Hidden";
import SendIcon from "@material-ui/icons/Send";
import { RootState } from "@store/configureStore";
import Skeleton from "@material-ui/lab/Skeleton";
import TextField from "@material-ui/core/TextField";
import { useErrorHandler } from "react-error-boundary";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { COLLECTIONS } from "@src/api/firebaseClientApi";
import { BaseEmoji, Picker, emojiIndex } from "emoji-mart";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { SearchContextManager } from "@giphy/react-components";
import InputAdornment from "@material-ui/core/InputAdornment";
import GifPickerComponent from "@components/common/GifPicker";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { FirebaseReducer, isLoaded, useFirestore } from "react-redux-firebase";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfied";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import {
  usePopupState,
  bindTrigger,
  bindPopper,
} from "material-ui-popup-state/hooks";

const useStyles = makeStyles((theme) =>
  createStyles({
    messageTextField: {
      borderRadius: theme.spacing(2),
    },
    giphyPicker: {
      width: "100%",
    },
  })
);

type BottomNavValType = "emoji" | "gif";

const Input: any = React.forwardRef((props: any, ref) => {
  const classes = useStyles();
  const {
    onChange,
    onBlur,
    onClick,
    onKeyDown,
    onScroll,
    onSelect,
    onKeyPress,
  } = props;
  return (
    <TextField
      fullWidth
      multiline
      size={"small"}
      inputRef={ref}
      margin={"dense"}
      value={props.value}
      InputProps={{
        onClick,
        onBlur,
        onKeyDown,
        onScroll,
        onChange,
        onSelect,
        onKeyPress,
        classes: {
          notchedOutline: classes.messageTextField,
        },
        endAdornment: props.endAdornment,
      }}
      rowsMax={5}
      variant={"outlined"}
      placeholder={"Type a message..."}
    />
  );
});

const MessageFieldComponent: React.FC = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const router = useRouter();
  const firestore = useFirestore();
  const handleError = useErrorHandler();
  const [text, setText] = React.useState("");
  const mobile = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const [bottomNavVal, setBottomNavVal] = React.useState<BottomNavValType>(
    "emoji"
  );
  const popupState = usePopupState({
    variant: "popper",
    popupId: "emoji-popper",
  });
  const auth = useSelector<RootState, FirebaseReducer.AuthState>(
    (state) => state.firebase.auth
  );

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleBottomNavChange = (
    event: React.ChangeEvent,
    newValue: BottomNavValType
  ) => {
    setBottomNavVal(newValue);
  };

  const handleOnKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      if (!mobile) {
        event.preventDefault();
        handleSendMsg();
      }
    }

    if (event.shiftKey && event.key === "Enter") {
      setText((prevText) => prevText.concat("\n"));
    }
  };

  const handleClickAway = () => {
    popupState.close();
  };

  const handleEmojiClick = (emoji: BaseEmoji) => {
    setText((prevText) => prevText.concat(emoji.native));
  };

  const handleGifClick = async (
    gif: IGif,
    e: React.SyntheticEvent<HTMLElement, Event>
  ) => {
    try {
      const conversationDocId = router.query.conversation_uid as string;
      await firestore
        .collection(COLLECTIONS.conversations)
        .doc(conversationDocId)
        .collection(COLLECTIONS.messages)
        .add({
          type: "gif",
          message: gif,
          deleted_at: null,
          sender_id: auth.uid,
          created_at: new Date().toISOString(),
        });
    } catch (error) {
      handleError(error);
    }
  };

  const handleSendMsg = async () => {
    if (!!text && isLoaded(auth)) {
      try {
        const conversationDocId = router.query.conversation_uid as string;
        await firestore
          .collection(COLLECTIONS.conversations)
          .doc(conversationDocId)
          .collection(COLLECTIONS.messages)
          .add({
            type: "text",
            message: text,
            deleted_at: null,
            sender_id: auth.uid,
            created_at: new Date().toISOString(),
          });
        setText("");
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <Box display={"flex"}>
      <ReactTextareaAutocomplete<any>
        value={text}
        textAreaComponent={Input}
        onChange={handleTextChange}
        onKeyPress={handleOnKeyPress}
        loadingComponent={() => (
          <Skeleton variant="rect" width={210} height={118} />
        )}
        endAdornment={
          <InputAdornment position={"end"}>
            <IconButton color={"primary"} {...bindTrigger(popupState)}>
              <SentimentSatisfiedAltIcon fontSize={"large"} />
            </IconButton>
          </InputAdornment>
        }
        trigger={{
          ":": {
            dataProvider: (token) =>
              (emojiIndex as any).search(token).map((o: BaseEmoji) => ({
                colons: o.colons,
                native: o.native,
              })),
            component: ({ entity: { native, colons } }) => (
              <Typography paragraph>{`${colons} ${native}`}</Typography>
            ),
            output: (item) => `${item.native}`,
          },
        }}
      />

      <IconButton disabled={!text} color={"primary"} onClick={handleSendMsg}>
        <SendIcon fontSize={"large"} />
      </IconButton>

      <Hidden smDown>
        <Popper transition placement={"top-end"} {...bindPopper(popupState)}>
          {({ TransitionProps }) => (
            <Fade timeout={350} {...TransitionProps}>
              <span>
                <ClickAwayListener onClickAway={handleClickAway}>
                  <Picker
                    title={""}
                    set={"facebook"}
                    showPreview={false}
                    emojiTooltip={false}
                    onSelect={handleEmojiClick}
                  />
                </ClickAwayListener>
              </span>
            </Fade>
          )}
        </Popper>
      </Hidden>

      <Hidden lgUp>
        <Drawer
          anchor={"bottom"}
          open={popupState.isOpen}
          onClose={popupState.close}
        >
          {bottomNavVal === "emoji" && (
            <Picker
              style={{
                width: "100%",
              }}
              title={""}
              set={"facebook"}
              showPreview={false}
              emojiTooltip={false}
              onSelect={handleEmojiClick}
            />
          )}

          {bottomNavVal === "gif" && (
            <span>
              <SearchContextManager
                initialTerm={"vegeta"}
                apiKey={process.env.NEXT_PUBLIC_GIPHY_SDK_API_KEY}
              >
                <GifPickerComponent
                  onGifClick={handleGifClick}
                  width={typeof window !== "undefined" ? window.innerWidth : 0}
                />
              </SearchContextManager>
            </span>
          )}
          <BottomNavigation
            value={bottomNavVal}
            onChange={handleBottomNavChange}
          >
            <BottomNavigationAction
              value={"emoji"}
              icon={<SentimentSatisfiedAltIcon />}
            />

            <BottomNavigationAction value={"gif"} icon={<GifIcon />} />
          </BottomNavigation>
        </Drawer>
      </Hidden>
    </Box>
  );
};

export default MessageFieldComponent;
