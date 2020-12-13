import { MessengerContext } from '@src/context/MessengerProvider'
import React from 'react'

const useMessenger = () => React.useContext(MessengerContext)

export default useMessenger
