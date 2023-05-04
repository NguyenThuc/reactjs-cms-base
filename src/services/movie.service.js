import { MOVIE_URL } from '../constant'
import { instance as axios } from '../helpers/axios-instance'

const getTable = (props) => {
  const { pageIndex, pageSize, sort, paramSearch } = props
  let url = `${MOVIE_URL}/table?page=${pageIndex}&size=${pageSize}&sort=${sort}`
  if (!!paramSearch.path) {
    url += `&path=${paramSearch.path.trim()}`
  }
  return axios.get(url)
}

const movieService = {
  getTable,
}

export default movieService
