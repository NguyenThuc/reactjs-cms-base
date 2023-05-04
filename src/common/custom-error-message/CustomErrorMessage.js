import { ErrorMessage } from '@hookform/error-message'
import { CFormFeedback } from '@coreui/react'
import React from 'react'

const MultipleErrorMessage = (props) => {
  const { name, errors } = props
  return (
    <ErrorMessage errors={errors} name={name}>
      {({ messages }) =>
        messages &&
        Object.entries(messages).map(([type, message]) => (
          <CFormFeedback key={type} style={{ display: 'flex' }} invalid>
            {message}
          </CFormFeedback>
        ))
      }
    </ErrorMessage>
  )
}

const SingleErrorMessage = (props) => {
  const { name, errors } = props
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => (
        <CFormFeedback role="alert" style={{ display: 'flex' }} invalid>
          {message}
        </CFormFeedback>
      )}
    />
  )
}

export { MultipleErrorMessage, SingleErrorMessage }
