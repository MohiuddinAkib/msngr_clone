import React from "react";
import propTypes from "prop-types"
import Slide from "@material-ui/core/Slide";
import GifIcon from "@material-ui/icons/Gif";
import Dialog from "@material-ui/core/Dialog";
import NoteIcon from "@material-ui/icons/Note";
import CameraIcon from "@material-ui/icons/Camera";
import IconButton from "@material-ui/core/IconButton";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import KeyboardVoiceIcon from "@material-ui/icons/KeyboardVoice";
import Button from "@material-ui/core/Button";

interface Props {
    buttonsPositionOnTop?: boolean
    showHiddenBtns?: boolean
    dialog?: boolean
}

const MessageActionBtnsComponent: React.FC<Props> = (props) => {

    const cameraBtn = (
        <IconButton color={"primary"}>
            <CameraIcon fontSize={"large"}/>
        </IconButton>
    )

    const recordBtn = (
        <IconButton color={"primary"}>
            <KeyboardVoiceIcon fontSize={"large"}/>
        </IconButton>
    )

    const buttonsWhenNotDialog = (
        <>
            {
                props.buttonsPositionOnTop && (
                    <>
                        {cameraBtn}
                        {recordBtn}
                    </>
                )
            }
            <Slide
                direction="right"
                in={!props.buttonsPositionOnTop && props.showHiddenBtns}
                unmountOnExit>
                {cameraBtn}
            </Slide>

            <Slide
                direction="right"
                in={!props.buttonsPositionOnTop && props.showHiddenBtns}
                unmountOnExit>
                {recordBtn}
            </Slide>

            <IconButton color={"primary"}>
                <GifIcon fontSize={"large"}/>
            </IconButton>

            <IconButton color={"primary"}>
                <NoteIcon fontSize={"large"}/>
            </IconButton>

            <IconButton color={"primary"}>
                <InsertPhotoIcon fontSize={"large"}/>
            </IconButton>
        </>
    )

    const buttonsWhenDialog = (
        <Dialog
            fullScreen
            open={props.dialog && props.showHiddenBtns}
        >
            <Button>
                First button
            </Button>
        </Dialog>
    )

    return (
        props.dialog ? buttonsWhenDialog : buttonsWhenNotDialog
    )
};

MessageActionBtnsComponent.defaultProps = {
    buttonsPositionOnTop: false,
    showHiddenBtns: false,
    dialog: false
}

MessageActionBtnsComponent.propTypes = {
    buttonsPositionOnTop: propTypes.bool,
    showHiddenBtns: propTypes.bool,
    dialog: propTypes.bool
}

export default MessageActionBtnsComponent;