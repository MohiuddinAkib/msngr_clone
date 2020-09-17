import React from "react";
import styled from "styled-components";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import {getContent} from "@mui-treasury/layout";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import MessageActionContainerComponent from "@components/messenger/content/ActionContainer";

const Content = getContent(styled);

const LayoutContentComponent: React.FC = (props) => {

    return (
        <Content>
            <Grid
                square
                container
                elevation={0}
                component={Card}
                direction={"column"}
                // justify={"flex-start"}
                // alignContent={"stretch"}
            >
                <Grid
                    item
                    flex={1}
                    component={Box}
                >
                    <CardContent>
                        {props.children}
                    </CardContent>
                </Grid>

                <Grid
                    item
                    component={CardActions}
                >
                    <MessageActionContainerComponent/>
                </Grid>
            </Grid>
        </Content>

    );
};

export default LayoutContentComponent;