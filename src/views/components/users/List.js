import React from 'react'
import EnhancedTable from '../../../common/table/EnhancedTable'
import { makeStyles } from '@material-ui/core/styles'
import { DeleteOutlined, EditOutlined, VisibilityTwoTone } from '@material-ui/icons'
import userService from '../../../services/user.service'
import { ModalConfirmContext } from '../../../common/context/ModalConfirmContext'
import { Search } from './Search'
import { useHistory } from 'react-router-dom'

const useStyle = makeStyles(() => ({
  pointer: {
    cursor: 'pointer',
  },
  centerInDiv: {
    textAlignLast: 'center',
  },
}))

const List = () => {
  const columnActionClass = useStyle()
  const history = useHistory()
  const [data, setData] = React.useState([])
  const [pageCount, setPageCount] = React.useState(0)
  const { setModalVisible, setModalConfig } = React.useContext(ModalConfirmContext)

  const columnAction = (row) => {
    return (
      <div className={columnActionClass.centerInDiv}>
        <EditOutlined className={columnActionClass.pointer} onClick={() => handleEdit(row)} />{' '}
        <DeleteOutlined
          className={columnActionClass.pointer}
          color={'error'}
          onClick={() => handleDelete(row)}
        />{' '}
        <VisibilityTwoTone
          className={columnActionClass.pointer}
          color={'primary'}
          onClick={() => handleView(row)}
        />
      </div>
    )
  }

  const columns = [
    {
      Header: 'Id',
      accessor: 'id',
      width: '5%',
    },
    {
      Header: 'User Name ',
      accessor: 'userName',
      width: '20%',
    },
    {
      Header: 'Full Name',
      accessor: 'displayName',
      width: '35%',
    },
    {
      Header: 'Roles',
      Cell: (cell) => {
        return cell.value.join(', ')
      },
      accessor: 'roles',
      width: '30%',
    },
    {
      Header: '',
      accessor: 'action',
      Cell: (cell) => columnAction(cell.row.original),
      width: '10%',
    },
  ]

  const handleDelete = (row) => {
    setModalVisible(true)
    setModalConfig({
      title: {
        header: 'Delete',
        body: 'Are you sure deleting this row ?',
        footer: {
          confirm: 'Yes',
          cancel: 'No',
        },
      },
      onConfirm: () => {
        userService
          .deleteUser(row.id)
          .then(() => setData((prevData) => prevData.filter((item) => item.id !== row.id)))
      },
    })
  }
  const handleEdit = (row) => {
    history.push({
      pathname: '/users/edit',
      search: `?id=${row.id}`,
    })
  }

  const handleView = (row) => {
    history.push({
      pathname: '/users/view',
      search: `?id=${row.id}`,
    })
  }

  const getUserList = (props) => {
    const { pageIndex, pageSize, sortBy, paramSearch } = props
    let sort = `${sortBy[0].id === 'roles' ? 'role.name' : sortBy[0].id},${
      sortBy[0].desc ? 'desc' : 'asc'
    }`
    userService.getUserList({ pageIndex, pageSize, sort, paramSearch }).then((response) => {
      const { content, totalElements } = response.data
      setData(content)
      setPageCount(totalElements)
    })
  }
  return (
    <div>
      <EnhancedTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        getDataListAPI={getUserList}
        filterComponent={Search}
      />
    </div>
  )
}

export default List
