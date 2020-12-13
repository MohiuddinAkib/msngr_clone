import React from "react";
import { NextPage } from "next";
import withAuth from "@components/auth/withAuth";
import MessengerLayout from "@layouts/MessengerLayout";
import MessagesPeopleTab from "@layouts/MessagesPeopleTab";
import ConversationListContainer from "@containers/messenger/ConversationListContainer";

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
