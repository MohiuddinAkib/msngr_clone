import React from 'react'
import useAuth from './useAuth';
import useOtherParticipant from './useOtherParticipant';
import { IUserPresence } from '@src/models/IUserPresence';

const useUserPresence = (conversationId: string, hookUser?: string) => {
  const auth = useAuth();
  const { otherParticipant, otherParticipantLoaded } = useOtherParticipant(conversationId);
  const [otherParticipantPresence, setOtherParticipantPresence] = React.useState<IUserPresence>(null);

    React.useEffect(() => {
        if(!!hookUser) {
            console.log(hookUser)
        }

        if (otherParticipantLoaded) {
            console.log(hookUser, otherParticipant)
            const presence = auth.getUserPresence(otherParticipant.id);
            setOtherParticipantPresence(presence);
        }
    }, [otherParticipant, otherParticipantLoaded]);

    return {otherParticipantPresence, otherParticipantLoaded}
}

export default useUserPresence
