import React from 'react'
import { IOCContainerContext } from '@src/context/IOCContainerProvider'

const useIocContainer = () =>  React.useContext(IOCContainerContext).container


export default useIocContainer
