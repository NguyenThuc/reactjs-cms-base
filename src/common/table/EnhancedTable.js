import React from 'react'
import TablePagination from '@material-ui/core/TablePagination'
import TablePaginationActions from './TablePaginationActions'
import { usePagination, useRowSelect, useSortBy, useTable } from 'react-table'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableFoot,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Checkbox, Paper, TableSortLabel } from '@material-ui/core'
import { useLocation } from 'react-router-dom'

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef()
  const resolvedRef = ref || defaultRef

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return <Checkbox color="primary" ref={resolvedRef} {...rest} />
})

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'
const EnhancedTable = (props) => {
  const {
    columns,
    data,
    pageCount: controlledPageCount,
    getDataListAPI,
    filterComponent: FilterComponent,
    isCheckBox = false,
    isLocalStorage = true,
  } = props
  // make row's id unique because of the select box
  const getRowId = React.useCallback((row) => {
    return row.id
  }, [])

  const [paramSearch, setParamSearch] = React.useState({})
  const [btnSearch, setBtnSearch] = React.useState(false)
  const location = useLocation()
  const presentLocation = location.pathname?.split('/')[1]
  const storageName = `S_${presentLocation.toUpperCase()}`
  const storageItem = isLocalStorage ? localStorage.getItem(storageName) : undefined

  const fetchIdRef = React.useRef(0)

  const fetchData = React.useCallback((props) => {
    const { pageIndex, pageSize, sortBy, paramSearch } = props
    const fetchId = ++fetchIdRef.current
    if (fetchId === fetchIdRef.current) {
      getDataListAPI({ pageIndex, pageSize, sortBy, paramSearch })
    }
  }, [])

  const useTableStyles = makeStyles((theme) => ({
    table: {
      marginTop: theme.spacing(3),
      '& thead tr': {
        fontWeight: '600',
        backgroundColor: '#2175ac',
      },
      '& thead th': {
        color: 'white',
        verticalAlign: 'middle',
        textAlign: 'center',
        padding: isCheckBox ? 0 : '',
      },
      '& thead th span svg': {
        color: 'white !important',
      },
      '& tbody td': {
        fontWeight: '300',
        verticalAlign: 'middle',
        paddingTop: isCheckBox ? 0 : '',
        paddingBottom: isCheckBox ? 0 : '',
      },

      '& tbody td span': {
        display: 'block',
        textAlign: 'center',
        margin: '0 auto',
      },
    },
  }))

  const usePaperStyles = makeStyles((theme) => ({
    pageContent: {
      padding: theme.spacing(3),
    },
  }))

  const paperClasses = usePaperStyles()
  const tableClasses = useTableStyles()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: storageItem ? JSON.parse(storageItem).pageIndex : 0,
        pageSize: storageItem ? JSON.parse(storageItem).pageSize : 10,
        sortBy: storageItem
          ? JSON.parse(storageItem).sortBy
          : [
              {
                id: 'id',
                desc: false,
              },
            ],
      },
      pageCount: controlledPageCount,

      manualPagination: true,
      manualSortBy: true,

      // Disables multi-sorting for the entire table.
      disableMultiSort: true,

      // If true, the un-sorted state will not be available to columns once they have been sorted.
      disableSortRemove: true,

      autoResetPage: false,
      autoResetSelectedRows: false,
      autoResetSortBy: false,

      getRowId,
    },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      if (isCheckBox) {
        hooks.allColumns.push((columns) => [
          // Let's make a column for selection
          {
            id: 'selection',
            width: '5%',
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox.  Pagination is a problem since this will select all
            // rows even though not all rows are on the current page.  The solution should
            // be server side pagination.  For one, the clients should not download all
            // rows in most cases.  The client should only download data for the current page.
            // In that case, getToggleAllRowsSelectedProps works fine.
            // eslint-disable-next-line react/display-name
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            // eslint-disable-next-line react/display-name
            Cell: ({ row }) => {
              return <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            },
          },
          ...columns,
        ])
      }
    },
  )

  // Update table storage each time (pageIndex, pageSize, sortBy) state change
  const isComponentDidMount = React.useRef(true)

  React.useEffect(() => {
    let fetchParam = {
      pageIndex,
      pageSize,
      sortBy,
      paramSearch,
    }

    if (isComponentDidMount.current) {
      if (storageItem) {
        fetchParam = JSON.parse(storageItem)
        setParamSearch(fetchParam.paramSearch)
      }
      isComponentDidMount.current = false
    }

    fetchData(fetchParam)
    localStorage.setItem(storageName, JSON.stringify(fetchParam))
  }, [pageIndex, pageSize, sortBy])

  // Update table storage each time paramSearch change and handle search case table in last page issues
  const isComponentDidUpdate = React.useRef(false)

  React.useEffect(() => {
    if (isComponentDidUpdate.current && btnSearch && isLocalStorage) {
      if (pageIndex === 0) {
        let fetchParam = {
          pageIndex,
          pageSize,
          sortBy,
          paramSearch,
        }
        fetchData(fetchParam)
        localStorage.setItem(storageName, JSON.stringify(fetchParam))
      } else {
        gotoPage(0)
      }
    }
    isComponentDidUpdate.current = true
  }, [paramSearch])
  // Clear all table storage state when reload page
  React.useEffect(() => {
    const removeStorageItem = () => localStorage.removeItem(storageName)
    window.addEventListener('beforeunload', removeStorageItem)
    return () => {
      window.removeEventListener('beforeunload', removeStorageItem)
    }
  }, [storageName])

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    const newEventPageSize = Number(event.target.value)
    setPageSize(newEventPageSize)
  }

  // Render the UI for your table
  return (
    <Paper className={paperClasses.pageContent}>
      <FilterComponent
        setParamSearch={setParamSearch}
        paramSearch={paramSearch}
        setBtnSearch={setBtnSearch}
      />
      <CTable className={tableClasses.table} {...getTableProps()} bordered={true} striped={true}>
        <CTableHead>
          {headerGroups.map((headerGroup, keyTR) => (
            <CTableRow key={`${keyTR}-head-table-row`} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, keyTHC) =>
                column.id === 'selection' || column.id === 'action' ? (
                  <CTableHeaderCell
                    key={`${keyTHC}-head-table-header-cell`}
                    scope="col"
                    {...column.getHeaderProps({
                      style: { width: column.width },
                    })}
                  >
                    {column.render('Header')}
                  </CTableHeaderCell>
                ) : (
                  <CTableHeaderCell
                    scope="col"
                    {...column.getHeaderProps({
                      ...column.getSortByToggleProps(),
                      ...{
                        style: { width: column.width },
                      },
                    })}
                  >
                    {column.render('Header')}
                    <TableSortLabel
                      active={column.isSorted}
                      // react-table has a unsorted state which is not treated here
                      direction={column.isSortedDesc ? 'desc' : 'asc'}
                    />
                  </CTableHeaderCell>
                ),
              )}
            </CTableRow>
          ))}
        </CTableHead>
        <CTableBody {...getTableBodyProps}>
          {page.map((row, keyTR) => {
            prepareRow(row)
            return (
              <CTableRow key={`${keyTR}-body-table-row`} {...row.getRowProps()}>
                {row.cells.map((cell, keyTDC) => {
                  return (
                    <CTableDataCell key={`${keyTDC}-body-table-data-cell`} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </CTableDataCell>
                  )
                })}
              </CTableRow>
            )
          })}
        </CTableBody>
        <CTableFoot>
          <CTableRow>
            <TablePagination
              count={controlledPageCount}
              page={pageIndex > 0 && controlledPageCount === 0 ? 0 : pageIndex}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[5, 10, 25]}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </CTableRow>
        </CTableFoot>
      </CTable>
    </Paper>
  )
}

EnhancedTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  pageCount: PropTypes.number.isRequired,
  getDataListAPI: PropTypes.func.isRequired,
  filterComponent: PropTypes.any,
  isCheckBox: PropTypes.bool,
  isLocalStorage: PropTypes.bool,
}

export default EnhancedTable
