import axios from 'axios'
import { AUTH_URL, ROOT_API } from '../constant'

const login = (username, password) => {
  return axios
    .post(`${ROOT_API}${AUTH_URL}/login`, {
      username,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }

      return response.data
    })
}

const logout = () => {
  localStorage.removeItem('user')
}

const auth = {
  login,
  logout,
}
export default auth
