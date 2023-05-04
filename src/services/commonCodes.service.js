import { COMMON_CODE_URL } from '../constant'
import { instance as axios } from '../helpers/axios-instance'

const getCommonByCode = (code) => {
  let url = `${COMMON_CODE_URL}/tree/?code=${code}`
  return axios.get(url)
}
const getCommonCodeById = (id) => {
  let url = `${COMMON_CODE_URL}/${id}`
  return axios.get(url)
}
const editCommonCode = (code, data) => {
  let url = `${COMMON_CODE_URL}/${code}`
  return axios.put(url, data)
}
const registerCommonCode = (data) => {
  let url = `${COMMON_CODE_URL}`
  return axios.post(url, data)
}
const deleteCommonCode = (id) => {
  let url = `${COMMON_CODE_URL}/${id}`
  return axios.delete(url)
}
const reOrderCommonCode = (data) => {
  let url = `${COMMON_CODE_URL}/displayOrder`
  return axios.put(url, data)
}
const CommonService = {
  getCommonByCode,
  deleteCommonCode,
  editCommonCode,
  getCommonCodeById,
  registerCommonCode,
  reOrderCommonCode,
}
export default CommonService
