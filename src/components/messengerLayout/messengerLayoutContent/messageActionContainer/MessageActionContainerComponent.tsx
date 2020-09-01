import React from 'react';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";

interface Props {
    actionButtons: React.ReactNode,
    messageField: React.ReactNode,
}

const MessageActionContainerComponent: React.FC<Props> = (props) => {
    const theme = useTheme()
    const atMd = useMediaQuery(theme.breakpoints.only("md"))

    return atMd ? (
            <>
                <Grid item md={12}>
                    {props.actionButtons}
                </Grid>
                <Grid item md={12}>
                    {props.messageField}
                </Grid>
            </>
        )
        :
        (
            <>
                <Grid item component={Box}>
                    {props.actionButtons}
                </Grid>
                <Grid item component={Box} flex={1}>
                    {props.messageField}
                </Grid>
            </>
        )
};

export default MessageActionContainerComponent;