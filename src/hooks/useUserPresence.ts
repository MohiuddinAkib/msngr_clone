import React from 'react'
import useAuth from './useAuth';
import useOtherParticipant from './useOtherParticipant';
import { IUserPresence } from '@src/models/IUserPresence';

const useUserPresence = (conversationId: string, hookUser?: string) => {
  const auth = useAuth();
  const { otherParticipant, otherParticipantLoaded, conversation } = useOtherParticipant(conversationId);
  const [otherParticipantPresence, setOtherParticipantPresence] = React.useState<IUserPresence>(null);

  React.useEffect(() => {
    if (otherParticipantLoaded && auth.presenceLoaded) {
      const presence = auth.presence[otherParticipant.id];
      setOtherParticipantPresence(presence);
    }
  }, [otherParticipant, otherParticipantLoaded, auth.presence]);

    return {otherParticipantPresence, otherParticipantLoaded, otherParticipant, conversation}
}

export default useUserPresence
