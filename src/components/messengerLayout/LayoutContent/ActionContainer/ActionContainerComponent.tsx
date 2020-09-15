import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";
import GifIcon from "@material-ui/icons/Gif";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import NoteIcon from "@material-ui/icons/Note";
import CameraIcon from "@material-ui/icons/Camera";
import IconButton from "@material-ui/core/IconButton";
import {withResizeDetector} from "react-resize-detector";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DialogContent from "@material-ui/core/DialogContent";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import KeyboardVoiceIcon from "@material-ui/icons/KeyboardVoice";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import AddCircleOulineIcon from "@material-ui/icons/AddCircleOutline";
import MessageTextFieldComponent from "@components/messengerLayout/LayoutContent/messageField";

interface Props {
    height: number;
    width: number;
}

const useStyles = makeStyles(theme => createStyles({
    actionSlide: {
        backgroundColor: "#fafafa"
    }
}))

const ActionContainerComponent: React.FC<Props> = (props) => {
    const theme = useTheme()
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)
    const xsAndSm = useMediaQuery(theme.breakpoints.between("xs", "sm"))

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

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

    const actionTop = (!xsAndSm && props.width < 600) && (
        <Slide direction="up" unmountOnExit in={open}>
            <Grid item component={Box} xs={12} className={classes.actionSlide}>
                {cameraBtn}

                {recordBtn}

                <IconButton color={"primary"}>
                    <GifIcon fontSize={"large"}/>
                </IconButton>

                <IconButton color={"primary"}>
                    <NoteIcon fontSize={"large"}/>
                </IconButton>

                <IconButton color={"primary"}>
                    <InsertPhotoIcon fontSize={"large"}/>
                </IconButton>
            </Grid>
        </Slide>
    )

    const actionRight = (!xsAndSm && props.width >= 600) && (
        <span>
            <Slide
                in={open}
                unmountOnExit
                direction="right"
            >
                {cameraBtn}
            </Slide>

            <Slide
                in={open}
                unmountOnExit
                direction="right"
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
            </span>
    )

    const actionDialog = xsAndSm && (
        <Drawer
            open={open}
            anchor={"bottom"}
            onClose={handleToggle}
        >
            <DialogContent dividers>
                <Button onClick={handleToggle}>
                    First button
                </Button>
            </DialogContent>
        </Drawer>
    )

    return (
        <Grid container>
            {actionDialog}
            {/* WHEN SIZE OF THE CONTAINER IS LESS THAN 0R EQUAL TO 600 */}
            {actionTop}

            <Grid item component={Box}>
                <IconButton color={"primary"} onClick={handleToggle}>
                    <AddCircleOulineIcon fontSize={"large"}/>
                </IconButton>
                {/* WHEN SIZE OF THE CONTAINER IS GREATER THAN 0R EQUAL TO 600 */}
                {actionRight}
            </Grid>

            <Grid item component={Box} flex={1}>
                <MessageTextFieldComponent/>
            </Grid>
        </Grid>
    )

};

export default withResizeDetector(ActionContainerComponent);