import React from 'react'
import { AppContext } from '@src/context/AppProvider'

const useApp = () => React.useContext(AppContext)

export default useApp
