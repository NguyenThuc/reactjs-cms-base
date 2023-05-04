import { CONTENT_PROVIDER_URL, ROLE_URL, USER_URL } from '../constant'
import { instance as axios } from '../helpers/axios-instance'

const getUserList = (props) => {
  const { pageIndex, pageSize, sort, paramSearch } = props
  let url = `${USER_URL}/table?page=${pageIndex}&size=${pageSize}&sort=${sort}`
  if (!!paramSearch.userName) {
    url += `&userName=${paramSearch.userName.trim()}`
  }
  if (!!paramSearch.displayName) {
    url += `&displayName=${paramSearch.displayName.trim()}`
  }
  return axios.get(url)
}
const addUser = (data) => {
  return axios.post(`${USER_URL}`, data)
}
const getContentProvider = () => {
  return axios.get(`${CONTENT_PROVIDER_URL}`)
}
const getRoles = () => {
  return axios.get(`${ROLE_URL}`)
}
const selectUserById = (id) => {
  return axios.get(`${USER_URL}/${id}`)
}
const updateBasicInfo = (id, data) => {
  return axios.put(`${USER_URL}/${id}/basicInfo`, data)
}
const deleteUser = (id) => {
  return axios.delete(`${USER_URL}/${id}`)
}

const userService = {
  getUserList,
  addUser,
  getContentProviders: getContentProvider,
  getRoles,
  selectUserById,
  updateBasicInfo,
  deleteUser,
}

export default userService
