import React from "react";
import styled from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import {Root, getContent, getInsetContainer, getStandardScheme} from "@mui-treasury/layout";

const scheme = getStandardScheme()
const Content = getContent(styled);
const Container = getInsetContainer(styled)



const AuthLayout: React.FC = (props) => {
    return (
        <Root scheme={scheme}>
            <CssBaseline/>
            <Content>
                <Container>
                    {props.children}
                </Container>
            </Content>
        </Root>
    );
};

export default AuthLayout;