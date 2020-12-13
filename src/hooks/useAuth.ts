import React from 'react'
import { AuthContext } from '@src/context/AuthProvider'

const useAuth = () => React.useContext(AuthContext)

export default useAuth
