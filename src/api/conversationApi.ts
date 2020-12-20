import {QuerySnapshot} from "@firebase/firestore-types"
import { Message, MessageBlock } from "@src/data/firestoreClient/domain/Message";
import { IUserFormattedMessage, IUserMessage } from "@src/models/IUserMessage";


export const formatMessageWithConverter = (querySnapshot: QuerySnapshot<Message>) => {
    const messageBlocks: MessageBlock[] = [];

    let matched = 0;
    let counter = 0;
    let last_index = 0;
    let last_sender = "";

    querySnapshot.forEach((doc) => {
        const message = doc.data();
        const key = message.id;

        const currentConversationMessage = message;

        if (currentConversationMessage.sender_id === last_sender) {
        const messageBlock = messageBlocks[last_index - matched];
        messageBlock.messages.push(message);
        matched++;
        } else {
        const messageBlock = new MessageBlock(key, [message]);
        messageBlocks.push(messageBlock);
        }

        last_index = counter;
        last_sender = currentConversationMessage.sender_id;
        counter++;
    });

    return messageBlocks
}


export const formatMessageWithoutConverter = (messageIds: string[], messages: IUserMessage[]) => {
    const messageBlocks: IUserFormattedMessage[] = [];

    let matched = 0;
    let counter = 0;
    let last_index = 0;
    let last_sender = "";

    messages.forEach((message, index) => {
        const key = messageIds[index];

        const currentConversationMessage = message;

        if (currentConversationMessage.sender_id === last_sender) {
            const messageBlock = messageBlocks[last_index - matched];
            messageBlock.messages.push({id: key, ...message});
            matched++;
        } else {
            messageBlocks.push({
                key,
                messages: [{id: key, ...message}]
            });
        }

        last_index = counter;
        last_sender = currentConversationMessage.sender_id;
        counter++;
    });

    return messageBlocks
}