import React from "react";
import Fade from "@material-ui/core/Fade"
import Popper from "@material-ui/core/Popper";
import {BaseEmoji, Picker} from "emoji-mart"
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfied";
import {usePopupState, bindTrigger, bindPopper} from "material-ui-popup-state/hooks"

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

    const handleOnKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault()
        }

        if (event.shiftKey && event.key === "Enter") {
            setText(prevText => prevText.concat("\n"))
        }
    }

    const handleClickAway = () => {
        popupState.close()
    }

    const handleEmojiClick = (emoji: BaseEmoji) => {
        setText(prevText => prevText.concat(emoji.native))
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
                rowsMax={5}
                variant={"outlined"}
                onChange={handleOnChange}
                onKeyPress={handleOnKeyPress}
                placeholder={"Type a message..."}
            />

            <Popper
                transition
                placement={"top-end"}
                {...bindPopper(popupState)}
            >
                {({TransitionProps}) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <span className={classes.emojiPickerContainer}>
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
        </>
    );
};

export default MessageTextFieldComponent;