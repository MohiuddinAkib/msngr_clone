import React from "react";
import { NextPage } from "next";
import withAuth from "@components/auth/withAuth";
import MessengerLayout from "@layouts/MessengerLayout";
import MessagesPeopleTab from "@layouts/MessagesPeopleTab";
import ConversationListContainer from "@containers/messenger/ConversationListContainer";
import Button from "@material-ui/core/Button";
import Link from "next/link";

const Index: NextPage = (props) => {
  return (
    <MessengerLayout>
      <MessagesPeopleTab>
        <ConversationListContainer />
      </MessagesPeopleTab>
    </MessengerLayout>
  );
};

export default withAuth(Index);
