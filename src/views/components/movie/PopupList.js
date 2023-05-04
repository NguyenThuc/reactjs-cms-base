import React from 'react'
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
import { makeStyles } from '@material-ui/core/styles'
import movieService from '../../../services/movie.service'
import { PopupSearch } from './PopupSearch'
import EnhancedTable from '../../../common/table/EnhancedTable'
import { ArrowForward } from '@material-ui/icons'

const useStyle = makeStyles(() => ({
  pointer: {
    cursor: 'pointer',
  },
  centerInDiv: {
    textAlignLast: 'center',
  },
}))

const MoviePopupList = (props) => {
  const { mdMovieVisible, setMdMovieVisible, vmdId, setVmdId, setVmName } = props
  const columnActionClass = useStyle()
  const [data, setData] = React.useState([])
  const [pageCount, setPageCount] = React.useState(0)

  const columnAction = (row) => {
    return (
      <div className={columnActionClass.centerInDiv}>
        <ArrowForward
          color={row.id === vmdId ? 'error' : 'primary'}
          className={columnActionClass.pointer}
          onClick={() => onSelectMovie(row)}
        />
      </div>
    )
  }

  const columns = [
    {
      Header: 'Id',
      accessor: 'id',
      width: '7%',
    },
    {
      Header: 'Path',
      accessor: 'originalFilePath',
      width: '48%',
    },
    {
      Header: 'Duration',
      accessor: 'displayRunTime',
      width: '10%',
    },
    {
      Header: 'Status',
      accessor: 'status',
      width: '20%',
    },
    {
      Header: '',
      accessor: 'action',
      Cell: (cell) => columnAction(cell.row.original),
      width: '10%',
    },
  ]

  const getMovieList = (props) => {
    const { pageIndex, pageSize, sortBy, paramSearch } = props
    let sort = `${sortBy[0].id},${sortBy[0].desc ? 'desc' : 'asc'}`
    movieService.getTable({ pageIndex, pageSize, sort, paramSearch }).then((response) => {
      const { content, totalElements } = response.data
      setData(content)
      setPageCount(totalElements)
    })
  }

  const onSelectMovie = (row) => {
    setVmdId(row.id)
    setVmName(row.fileName)
    setMdMovieVisible(false)
  }

  return (
    <CModal
      visible={mdMovieVisible}
      backdrop={'static'}
      onClose={() => setMdMovieVisible(false)}
      size={'xl'}
    >
      <CModalHeader>
        <CModalTitle>Movie</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <EnhancedTable
          columns={columns}
          data={data}
          pageCount={pageCount}
          getDataListAPI={getMovieList}
          filterComponent={PopupSearch}
          isLocalStorage={false}
        />
      </CModalBody>
    </CModal>
  )
}

export default MoviePopupList
