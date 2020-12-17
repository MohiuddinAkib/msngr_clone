import React from 'react'
import useMessenger from './useMessenger';
import { Participant } from '@src/data/domain/Participant';
import { Conversation } from '@src/data/domain/Conversation';


const useOtherParticipant = (conversationId: string | Conversation) => {
    const messenger = useMessenger()
    const [otherParticipant, setOtherParticipant] = React.useState<Participant>(
        null
      );
    const [otherParticipantLoaded, setOtherParticipantLoaded] = React.useState(
        false
      );
    const [conversation, setConversation] = React.useState<Conversation>(null)

    React.useEffect(() => {
        if(conversationId instanceof Conversation) {
            conversationId.getParticipantsData((participants) => {
                const [otherPerson] = participants.filter(
                  (participant) => !participant.isMe
                );
          
                setOtherParticipant(otherPerson);
                setOtherParticipantLoaded(true);
              });
        } else {

            (async() => {
                try {
                    const conversation = await messenger.getConversationById(conversationId)
                    setConversation(conversation)
                    conversation.getParticipantsData((participants) => {
                        const [otherPerson] = participants.filter(
                          (participant) => !participant.isMe
                        );
                  
                        setOtherParticipant(otherPerson);
                        setOtherParticipantLoaded(true);
                      });
                }catch(e) {
    
                }
            })()
        }
        
      }, []);

      return {otherParticipant, otherParticipantLoaded, conversation}
}

export default useOtherParticipant
