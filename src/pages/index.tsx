import React from "react";
import Link from "next/link";
import { NextPage } from "next";
import Box from "@material-ui/core/Box";
import MUILink from "@material-ui/core/Link";
import withAuth from "@components/auth/withAuth";
import ButtonLinkComponent from "@components/common/ButtonLink";

const App: NextPage = () => {
  return (
    <Box>
      <ButtonLinkComponent href={"/messages"} as={"/messages"}>
        Go to messages
      </ButtonLinkComponent>

      <Link href={"/login"} passHref>
        <MUILink>Go to messages</MUILink>
      </Link>
    </Box>
  );
};

export default withAuth(App);
