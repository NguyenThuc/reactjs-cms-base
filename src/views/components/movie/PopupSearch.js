import { useForm } from 'react-hook-form'
import { CButton, CButtonToolbar, CForm, CFormInput, CInputGroup } from '@coreui/react'
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

export const PopupSearch = (props) => {
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

  return (
    <CForm onSubmit={handleSubmit(onSubmit)}>
      <CButtonToolbar className="justify-content-between gap-2">
        <CInputGroup style={{ marginLeft: 'auto' }}>
          <CFormInput placeholder="Path" {...register('path')} />
          <CButton className={classes.btn} type="submit">
            Search
          </CButton>
        </CInputGroup>
      </CButtonToolbar>
    </CForm>
  )
}

PopupSearch.prototype = {
  paramSearch: PropTypes.object.isRequired,
  setParamSearch: PropTypes.func.isRequired,
  setBtnSearch: PropTypes.func.isRequired,
}
