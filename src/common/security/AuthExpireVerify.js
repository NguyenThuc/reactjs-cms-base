import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

const expireUserLogout = (props) => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    const decodedJwt = parseJwt(user.token)
    if (decodedJwt.exp * 1000 < Date.now()) {
      props.logOut()
    }
  }
}

const AuthExpireVerify = (props) => {
  const location = useLocation()
  const presentLocation = location.pathname?.split('/')[1]
  // Remove screen's storage when parent's path was change
  // Ex: cms/users/list --> cms/users/add (not remove storage)
  //     cms/users/list --> cms/common-codes/list (remove storage)
  useEffect(() => {
    const storageName = `S_${presentLocation.toUpperCase()}`
    for (let i = 0; i < localStorage.length; i++) {
      const localStorageKey = localStorage.key(i)
      if (storageName !== localStorageKey && localStorageKey.startsWith('S_')) {
        localStorage.removeItem(localStorage.key(i))
      }
    }
    expireUserLogout(props)
  }, [location, presentLocation, props])
  return <div />
}

export default AuthExpireVerify
