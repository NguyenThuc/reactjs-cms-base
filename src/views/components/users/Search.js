import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { P_USERS_ADD } from '../../../constant'
import Typography from '@material-ui/core/Typography'
import {
  CButton,
  CButtonToolbar,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const useStyle = makeStyles((theme) => ({
  title: {
    flex: '1 1 100%',
    marginBottom: '15px',
  },
  btn: {
    backgroundColor: '#2175ac',
    borderColor: '#2175ac',
  },
}))

export const Search = (props) => {
  const history = useHistory()
  const { paramSearch, setParamSearch, setBtnSearch } = props

  const { handleSubmit, register, setValue } = useForm()

  React.useEffect(() => {
    for (const [key, val] of Object.entries(paramSearch)) {
      setValue(key, val)
    }
  }, [paramSearch, setValue])

  const onSubmit = (state) => {
    setParamSearch(state)
    setBtnSearch(true)
  }

  const classes = useStyle()

  const handleAdd = () => {
    history.push(P_USERS_ADD)
  }

  return (
    <>
      <div className="row">
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Users
        </Typography>
      </div>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CButtonToolbar className="justify-content-between gap-2">
          <CButton className={classes.btn} type={'button'} onClick={handleAdd}>
            Add
          </CButton>

          <CInputGroup>
            <CFormInput placeholder="User Name" {...register('userName')} />
            <CInputGroupText />
            <CFormInput placeholder="displayName" {...register('displayName')} />
            <CButton className={classes.btn} type="submit">
              Search
            </CButton>
          </CInputGroup>
        </CButtonToolbar>
      </CForm>
    </>
  )
}

Search.prototype = {
  paramSearch: PropTypes.object.isRequired,
  setParamSearch: PropTypes.func.isRequired,
  setBtnSearch: PropTypes.func.isRequired,
}
