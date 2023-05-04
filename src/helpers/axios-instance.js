import axios from 'axios'
import authHeader from './auth-header'
import { ROOT_API } from '../constant'
import { toastError, toastSuccess } from '../common/toast/ToastContainer'

export const instance = axios.create({
  baseURL: ROOT_API,
  timeout: 2000,
  headers: authHeader(),
})

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    if (response.config.method !== 'get' && response.config.method !== 'GET') {
      toastSuccess(response.data?.message)
    }
    return response
  },
  function (error) {
    const errMessage = error.response ? error.response.data?.detail : error.message
    console.log(`Error in interceptors response axios (Debug Only) ${errMessage}`)
    toastError(errMessage)
    return Promise.reject(error)
  },
)
