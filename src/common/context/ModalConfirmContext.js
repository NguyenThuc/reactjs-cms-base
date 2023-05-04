import React from 'react'
import { ModalConfirmation } from '../modal/ModalConfirmation'

let ModalConfirmContext

const { Provider } = (ModalConfirmContext = React.createContext())

const ModalConfirmProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = React.useState(false)
  const [modalConfig, setModalConfig] = React.useState({})
  return (
    <Provider value={{ modalVisible, modalConfig, setModalVisible, setModalConfig }}>
      <ModalConfirmation />
      {children}
    </Provider>
  )
}

export { ModalConfirmContext, ModalConfirmProvider }
