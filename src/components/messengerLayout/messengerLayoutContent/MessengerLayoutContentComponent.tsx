import React from 'react';
import styled from "styled-components";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import GifIcon from "@material-ui/icons/Gif"
import NoteIcon from "@material-ui/icons/Note"
import {getContent} from "@mui-treasury/layout";
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto"
import InputAdornment from '@material-ui/core/InputAdornment';
import AddCircleOulineIcon from "@material-ui/icons/AddCircleOutline"
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfied"
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from "@material-ui/core/styles/useTheme";
import MessageActionContainerComponent from "@components/messengerLayout/messengerLayoutContent/messageActionContainer";

const Content = getContent(styled);

const MessengerLayoutContentComponent: React.FC = (props) => {
    return (
        <Content>
            <Grid
                square
                container
                elevation={0}
                component={Card}
                direction={"column"}
                alignItems={"stretch"}
            >
                <Grid item component={Box} flex={1}>
                    <CardContent>
                        {props.children}
                    </CardContent>
                </Grid>

                <Grid item container component={CardActions}>
                    <MessageActionContainerComponent
                        actionButtons={(
                            <>
                                <IconButton color={"primary"}>
                                    <AddCircleOulineIcon fontSize={"large"}/>
                                </IconButton>

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
                        )}

                        messageField={
                            <TextField
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position={"end"}>
                                            <IconButton color={"primary"}>
                                                <SentimentSatisfiedAltIcon fontSize={"large"}/>
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                variant={"outlined"}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </Content>

    );
};

export default MessengerLayoutContentComponent;