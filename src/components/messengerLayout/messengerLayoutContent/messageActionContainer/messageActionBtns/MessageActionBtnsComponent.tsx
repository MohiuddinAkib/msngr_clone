import React from "react";
import propTypes from "prop-types"
import Slide from "@material-ui/core/Slide";
import GifIcon from "@material-ui/icons/Gif";
import Dialog from "@material-ui/core/Dialog";
import NoteIcon from "@material-ui/icons/Note";
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/Camera";
import IconButton from "@material-ui/core/IconButton";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import KeyboardVoiceIcon from "@material-ui/icons/KeyboardVoice";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {TransitionProps} from "@material-ui/core/transitions/transition";

interface Props {
    buttonsPositionOnTop?: boolean
    showHiddenBtns?: boolean
    dialog?: boolean;
    onClose?: () => void
}

const useStyles = makeStyles(theme => createStyles({
    dialogScrollPaper: {
        [theme.breakpoints.between("xs", "sm")]: {
            alignItems: "flex-end",
        }
    },
    dialogPaperFullScreen: {
        [theme.breakpoints.between("xs", "sm")]: {
            height: "auto",
            minHeight: "50vh"
        }
    }
}))

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props}/>;
});

const MessageActionBtnsComponent: React.FC<Props> = (props) => {

    const classes = useStyles()

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
                unmountOnExit
                direction="right"
                in={!props.buttonsPositionOnTop && props.showHiddenBtns}
            >
                {cameraBtn}
            </Slide>

            <Slide
                unmountOnExit
                direction="right"
                in={!props.buttonsPositionOnTop && props.showHiddenBtns}
            >
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
            keepMounted
            onClose={props.onClose}
            TransitionComponent={Transition}
            open={props.dialog && props.showHiddenBtns}
            classes={{
                scrollPaper: classes.dialogScrollPaper,
                paperFullScreen: classes.dialogPaperFullScreen
            }}
        >
            <Button onClick={props.onClose}>
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
    dialog: propTypes.bool,
    onClose: propTypes.func
}

export default MessageActionBtnsComponent;