import React from 'react';
import List from '@material-ui/core/List';
import ConversationListItemComponent from "@components/messengerLayout/conversationListDrawer/conversationListItem";

const ConversationListComponent: React.FC = () => {
    return (
        <List>
            <ConversationListItemComponent/>
        </List>
    );
};

export default ConversationListComponent;