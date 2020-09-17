import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";
import GifIcon from "@material-ui/icons/Gif";
import Drawer from "@material-ui/core/Drawer";
import NoteIcon from "@material-ui/icons/Note";
import Hidden from "@material-ui/core/Hidden";
import CameraIcon from "@material-ui/icons/Camera";
import IconButton from "@material-ui/core/IconButton";
import {withResizeDetector} from "react-resize-detector";
import DialogContent from "@material-ui/core/DialogContent";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import KeyboardVoiceIcon from "@material-ui/icons/KeyboardVoice";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import AddCircleOulineIcon from "@material-ui/icons/AddCircleOutline";
import MessageFieldComponent from "@components/messenger/content/MessageField";

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
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    const cameraBtn = (
        <IconButton
            color={"primary"}
        >
            <CameraIcon
                fontSize={"large"}
            />
        </IconButton>
    )

    const recordBtn = (
        <IconButton
            color={"primary"}
        >
            <KeyboardVoiceIcon
                fontSize={"large"}
            />
        </IconButton>
    )

    const gifBtn = (
        <IconButton
            color={"primary"}
        >
            <GifIcon
                fontSize={"large"}
            />
        </IconButton>
    )

    const fileUploadBtn = (
        <IconButton
            color={"primary"}
        >
            <NoteIcon
                fontSize={"large"}
            />
        </IconButton>
    )


    const insertPhotoBtn = (
        <IconButton
            color={"primary"}
        >
            <InsertPhotoIcon
                fontSize={"large"}
            />
        </IconButton>
    )

    const actionTop = props.width < 600 && (
        <Hidden
            smDown
        >
            <Slide
                in={open}
                unmountOnExit
                direction="up"
            >
                <Grid
                    item
                    xs={12}
                    component={Box}
                    className={classes.actionSlide}
                >
                    {cameraBtn}

                    {recordBtn}

                    {gifBtn}

                    {fileUploadBtn}

                    {insertPhotoBtn}
                </Grid>
            </Slide>
        </Hidden>

    )

    const actionRight = props.width >= 600 && (
        <Hidden
            smDown
        >
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

            {gifBtn}

            {fileUploadBtn}

            {insertPhotoBtn}
        </Hidden>
    )

    const actionDialog = (
        <Hidden
            lgUp
        >
            <Drawer
                open={open}
                anchor={"bottom"}
                onClose={handleToggle}
            >
                <DialogContent
                    dividers
                >
                    {cameraBtn}

                    {recordBtn}

                    {gifBtn}

                    {fileUploadBtn}

                    {insertPhotoBtn}
                </DialogContent>
            </Drawer>
        </Hidden>
    )

    return (
        <Grid container>
            {actionDialog}
            {/* WHEN SIZE OF THE CONTAINER IS LESS THAN 0R EQUAL TO 600 */}
            {actionTop}

            <Grid
                item
                component={Box}>
                <IconButton
                    color={"primary"}
                    onClick={handleToggle}
                >
                    <AddCircleOulineIcon
                        fontSize={"large"}
                    />
                </IconButton>
                {/* WHEN SIZE OF THE CONTAINER IS GREATER THAN 0R EQUAL TO 600 */}
                {actionRight}
            </Grid>

            <Grid
                item
                flex={1}
                component={Box}
            >
                <MessageFieldComponent/>
            </Grid>
        </Grid>
    )

};

export default withResizeDetector(ActionContainerComponent);