import React from "react";
import Fade from "@material-ui/core/Fade"
import {BaseEmoji, Picker} from "emoji-mart"
import GifIcon from "@material-ui/icons/Gif";
import IGif from "@giphy/js-types/dist/gif";
import Drawer from "@material-ui/core/Drawer";
import Popper from "@material-ui/core/Popper";
import Hidden from "@material-ui/core/Hidden";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {SearchContextManager} from "@giphy/react-components";
import InputAdornment from "@material-ui/core/InputAdornment";
import GifPickerComponent from "@components/common/GifPicker";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {createStyles, makeStyles, useTheme} from "@material-ui/core/styles";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfied";
import {usePopupState, bindTrigger, bindPopper} from "material-ui-popup-state/hooks"

const useStyles = makeStyles(theme => createStyles({
    messageTextField: {
        borderRadius: theme.spacing(2)
    },
    giphyPicker: {
        width: "100%"
    }
}))

type BottomNavValType = "emoji" | "gif"

const MessageFieldComponent: React.FC = (props) => {
    const classes = useStyles()
    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.between("xs", "sm"))
    const [bottomNavVal, setBottomNavVal] = React.useState<BottomNavValType>("emoji")

    const popupState = usePopupState({
        variant: "popper",
        popupId: "emoji-popper",
    })

    const [text, setText] = React.useState("")

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
    }

    const handleBottomNavChange = (event: React.ChangeEvent, newValue: BottomNavValType) => {
        setBottomNavVal(newValue)
    }

    const handleOnKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            if (!mobile) {
                event.preventDefault()
            }
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

    const handleGifClick = (gif: IGif, e: React.SyntheticEvent<HTMLElement, Event>) => {
        console.log(gif)
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
                onChange={handleTextChange}
                onKeyPress={handleOnKeyPress}
                placeholder={"Type a message..."}
            />

            <Hidden
                smDown
            >
                <Popper
                    transition
                    placement={"top-end"}
                    {...bindPopper(popupState)}
                >
                    {({TransitionProps}) => (
                        <Fade
                            timeout={350}
                            {...TransitionProps}
                        >
                        <span>
                            <ClickAwayListener
                                onClickAway={handleClickAway}
                            >
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

            <Hidden
                lgUp
            >
                <Drawer
                    anchor={"bottom"}
                    open={popupState.isOpen}
                    onClose={popupState.close}
                >
                    {
                        bottomNavVal === "emoji" && <Picker
                            style={{
                                width: "100%"
                            }}
                            title={""}
                            set={"facebook"}
                            showPreview={false}
                            emojiTooltip={false}
                            onSelect={handleEmojiClick}
                        />
                    }

                    {/*</Fade>*/}


                    {bottomNavVal === "gif" && <span>
                             <SearchContextManager
                                 initialTerm={"vegeta"}
                                 apiKey={process.env.NEXT_PUBLIC_GIPHY_SDK_API_KEY}
                             >
                            <GifPickerComponent
                                onGifClick={handleGifClick}
                                width={typeof window !== 'undefined' ? window.innerWidth : 0}
                            />
                             </SearchContextManager>
                        </span>}
                    <BottomNavigation
                        value={bottomNavVal}
                        onChange={handleBottomNavChange}
                    >
                        <BottomNavigationAction
                            value={"emoji"}
                            icon={<SentimentSatisfiedAltIcon/>}
                        />

                        <BottomNavigationAction
                            value={"gif"}
                            icon={<GifIcon/>}
                        />
                    </BottomNavigation>
                </Drawer>
            </Hidden>
        </>
    );
};

export default MessageFieldComponent;