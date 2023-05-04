import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React from 'react'
import PropTypes from 'prop-types'
import { ModalConfirmContext } from '../context/ModalConfirmContext'

export const ModalConfirmation = () => {
  const { modalVisible, modalConfig, setModalVisible } = React.useContext(ModalConfirmContext)
  const { title, onConfirm, onCancel, modalRef } = modalConfig
  const { header, body, footer } = title ? title : {}

  const handleClickConfirm = () => {
    setModalVisible(false)
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm()
    }
  }

  const handleClickCancel = () => {
    setModalVisible(false)
    if (onCancel && typeof onCancel === 'function') {
      onCancel()
    }
  }

  if (modalVisible) {
    return (
      <CModal
        portal={true}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        backdrop={'static'}
        {...modalRef}
      >
        {header && (
          <CModalHeader>
            <CModalTitle>{header}</CModalTitle>
          </CModalHeader>
        )}
        <CModalBody>{body}</CModalBody>
        <CModalFooter>
          <CButton onClick={handleClickConfirm} color="primary">
            {footer.confirm ? footer.confirm : 'Confirm'}
          </CButton>
          <CButton color="secondary" onClick={handleClickCancel}>
            {footer.cancel ? footer.cancel : 'Close'}
          </CButton>
        </CModalFooter>
      </CModal>
    )
  } else return null
}

ModalConfirmation.propTypes = {
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  title: PropTypes.shape({
    header: PropTypes.string,
    body: PropTypes.string,
    footer: PropTypes.shape({
      confirm: PropTypes.string,
      cancel: PropTypes.string,
    }),
  }),
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
}
