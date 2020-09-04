import React from "react";
import dynamic from "next/dynamic"
import Popper from '@material-ui/core/Popper';
import {IEmojiData} from "emoji-picker-react";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfied";

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

    const [text, setText] = React.useState("")
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
    }

    const handleClickAway = () => {
        setAnchorEl(null)
    }

    const handlePopoverToggle = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }

    const handleEmojiClick = (event: MouseEvent, emojiObject: IEmojiData) => {
        setText(prevText => prevText.concat(emojiObject.emoji))
    }

    const open = Boolean(anchorEl);
    const id = open ? 'emoji-popper' : undefined;

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
                                aria-describedby={id}
                                color={"primary"}
                                onClick={handlePopoverToggle}>
                                <SentimentSatisfiedAltIcon fontSize={"large"}/>
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                variant={"outlined"}
                onChange={handleOnChange}
            />

            <Popper
                id={id}
                open={open}
                disablePortal
                placement={"top-end"}
                anchorEl={anchorEl}
            >
                <ClickAwayListener onClickAway={handleClickAway}>
                    <span className={classes.emojiPickerContainer}>
                        <Picker
                            disableSearchBar
                            onEmojiClick={handleEmojiClick}
                        />
                    </span>
                </ClickAwayListener>
            </Popper>
        </>
    );
};

export default MessageTextFieldComponent;