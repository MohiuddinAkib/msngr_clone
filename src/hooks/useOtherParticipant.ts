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
                    conversation.getParticipantsData((participants) => {
                        const [otherPerson] = participants.filter(
                          (participant) => !participant.isMe
                        );
                        alert(otherPerson.id)
                  
                        setOtherParticipant(otherPerson);
                        setOtherParticipantLoaded(true);
                      });
                }catch(e) {
    
                }
            })()
        }
        
      }, []);

      return {otherParticipant, otherParticipantLoaded}
}

export default useOtherParticipant
