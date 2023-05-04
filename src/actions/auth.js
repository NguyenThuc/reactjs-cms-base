import { LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT, SET_MESSAGE } from './type'

import AuthService from '../services/auth.service'
import { toastPromise, toastSuccess } from '../common/toast/ToastContainer'

export const login = (username, password) => (dispatch) => {
  return toastPromise(
    AuthService.login(username, password).then(
      (data) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: data },
        })

        return Promise.resolve('Login Success')
      },
      (error) => {
        const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()

        dispatch({
          type: LOGIN_FAIL,
        })

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        })
        return Promise.reject(`Login Failed: ${message}`)
      },
    ),
  )
}

export const logout = () => (dispatch) => {
  AuthService.logout()

  dispatch({
    type: LOGOUT,
  })

  // Prevent duplicate toast
  toastSuccess('Logout Success', { toastId: 'logout' })
}
