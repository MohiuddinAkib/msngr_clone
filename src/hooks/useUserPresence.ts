import React from 'react'
import useAuth from './useAuth';

const useUserPresence = (userId: string) => {
  const auth = useAuth();

  return auth.getUserPresence(userId)
}

export default useUserPresence
