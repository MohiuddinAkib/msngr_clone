import React from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";

const AuthLayout: React.FC = (props) => {
    return (
        <Container maxWidth="md">
            <CssBaseline/>
            {props.children}
        </Container>
    );
};

export default AuthLayout;