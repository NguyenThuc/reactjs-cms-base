import React from 'react'
import { Redirect } from 'react-router-dom'

const AuthStorageVerify = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) {
    return <Redirect to="/login" />
  }
  return <div />
}

export default AuthStorageVerify
