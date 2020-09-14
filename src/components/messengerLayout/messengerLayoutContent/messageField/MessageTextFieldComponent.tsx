import React from "react";
import dynamic from "next/dynamic"
import Fade from "@material-ui/core/Fade"
import Popper from "@material-ui/core/Popper";
import {IEmojiData} from "emoji-picker-react";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfied";
import {usePopupState, bindTrigger, bindPopper} from "material-ui-popup-state/hooks"


const Picker = dynamic(() => import("emoji-picker-react"), {ssr: false})

const useStyles = makeStyles(theme => createStyles({
    emojiPickerContainer: {
        "& > aside.emoji-picker-react": {
            flexDirection: "column-reverse"
        }
    },
    messageTextField: {
        borderRadius: theme.spacing(2)
    }
}))

const MessageTextFieldComponent: React.FC = (props) => {
    const classes = useStyles()

    const popupState = usePopupState({
        variant: "popper",
        popupId: "emoji-popper",
    })

    const [text, setText] = React.useState("")

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
    }

    const handleClickAway = () => {
        popupState.close()
    }

    const handleEmojiClick = (event: MouseEvent, emojiObject: IEmojiData) => {
        setText(prevText => prevText.concat(emojiObject.emoji))
    }

    return (
        <>
            <TextField
                fullWidth
                multiline
                value={text}
                size={"small"}
                margin={"dense"}
                InputProps={{
                    classes: {
                        notchedOutline: classes.messageTextField
                    },
                    endAdornment: (
                        <InputAdornment position={"end"}>
                            <IconButton
                                color={"primary"}
                                {...bindTrigger(popupState)}
                            >
                                <SentimentSatisfiedAltIcon fontSize={"large"}/>
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                rows={1}
                variant={"outlined"}
                onChange={handleOnChange}
            />

            <Popper
                transition
                placement={"top-end"}
                {...bindPopper(popupState)}
            >
                {({TransitionProps}) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <span className={classes.emojiPickerContainer}>
                                <Picker
                                    disableSearchBar
                                    onEmojiClick={handleEmojiClick}
                                />
                            </span>
                        </ClickAwayListener>
                    </Fade>
                )}

            </Popper>
        </>
    );
};

export default MessageTextFieldComponent;