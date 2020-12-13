import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";

const AuthLayout: React.FC = (props) => {
  return (
    <Box>
      <Container maxWidth="md">
        <CssBaseline />
        {props.children}
      </Container>
    </Box>
  );
};

export default AuthLayout;
