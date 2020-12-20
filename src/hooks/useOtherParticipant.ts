import React from 'react'
import useMessenger from './useMessenger';
import { Participant } from '@src/data/firestoreClient/domain/Participant';
import { Conversation } from '@src/data/firestoreClient/domain/Conversation';


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
        
      }, []);

      return {otherParticipant, otherParticipantLoaded, conversation}
}

export default useOtherParticipant
