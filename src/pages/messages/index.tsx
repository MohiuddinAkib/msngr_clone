import React from "react"
import {NextPage} from "next";
import withAuth from "@components/auth/withAuth";
import MessengerLayout from "@layouts/MessengerLayout";
import MessagesPeopleTab from "@layouts/MessagesPeopleTab";
import ConversationListComponent from "@containers/messenger/ConversationList";

const Index: NextPage = (props) => {
    return (
        <MessengerLayout>
            <MessagesPeopleTab>
                <ConversationListComponent/>
            </MessagesPeopleTab>
        </MessengerLayout>
    );
};

export default withAuth(Index);

// export const getServerSideProps: GetServerSideProps = getServerSidePropsPrivate()

