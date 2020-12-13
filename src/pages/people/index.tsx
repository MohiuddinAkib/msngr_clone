import React from "react";
import { NextPage } from "next";
import MessengerLayout from "@layouts/MessengerLayout";
import MessagesPeopleTab from "@layouts/MessagesPeopleTab";
import PeopleListComponent from "@containers/messenger/PeopleListContainer";

const Index: NextPage = () => {
  return (
    <MessengerLayout>
      <MessagesPeopleTab initialView={1}>
        <PeopleListComponent />
      </MessagesPeopleTab>
    </MessengerLayout>
  );
};

export default Index;
