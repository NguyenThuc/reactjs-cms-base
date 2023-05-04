import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { CButton, CCol, CContainer, CForm, CFormCheck, CFormInput, CFormLabel } from '@coreui/react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import Select from 'react-select/creatable'
import userServices from '../../../services/user.service'

const View = () => {
  const history = useHistory()
  const id = history.location.search.split('=')[1]
  const [userData, setUserData] = useState({
    roles: [],
  })
  const [roles, setRoles] = useState([])
  const [showCp, setShowCp] = useState(false)
  const [contentProviders, setContentProviders] = useState([])

  const { control, register, reset, setValue } = useForm()

  useEffect(() => {
    const getRoles = userServices.getRoles()
    const getContentProviders = userServices.getContentProviders()
    const getUserData = userServices.selectUserById(id)
    Promise.all([getRoles, getContentProviders, getUserData]).then((values) => {
      setRoles(values[0].data)
      setUserData(values[2].data)
      setContentProviders(values[1].data)
    })
  }, [id])

  useEffect(() => {
    if (userData) {
      reset(userData)
    }
  }, [userData])

  const rolesWatched = useWatch({
    control,
    name: 'roles',
  })

  useEffect(() => {
    if (Array.isArray(rolesWatched)) {
      let rolesWatchedCloned = [...rolesWatched]
      if (rolesWatchedCloned.length === 0) {
        setShowCp(false)
        return
      }
      let atLeastOneRequireCp = false
      rolesWatchedCloned.forEach((roleName) => {
        if (roles.find((roleAPI) => roleAPI.name === roleName).requireCp) {
          atLeastOneRequireCp = true
        }
      })
      if (!atLeastOneRequireCp) {
        setValue('cpId', undefined)
      }
      setShowCp(atLeastOneRequireCp)
    }
  }, [rolesWatched])

  return (
    <CContainer className="col-8">
      <div className="form-control">
        <CForm className="g-3 needs-validation">
          <h2 className="text-center py-2"> View User</h2>

          <CCol className="col-md-12 px-5 py-2">
            <CFormLabel>Display name *</CFormLabel>
            <CFormInput disabled={true} {...register('displayName')} />
          </CCol>
          <CCol className="col-md-12 px-5 py-2">
            <CFormLabel>Email *</CFormLabel>
            <CFormInput disabled={true} {...register('email')} />
          </CCol>

          <CCol className="col-md-12 px-5 py-2">
            <CFormLabel>Roles *</CFormLabel>
          </CCol>
          <CCol className="col-md-12 px-5 py-2">
            {roles.map((role) => (
              <CFormCheck
                disabled={true}
                inline
                key={role.id}
                label={role.displayName}
                value={role.name}
                {...register('roles')}
              />
            ))}
          </CCol>

          {showCp ? (
            <CCol className="col-md-12 px-5 py-2">
              <CFormLabel>Content provider </CFormLabel>
              <Controller
                name={'cpId'}
                control={control}
                defaultValue={[]}
                render={({ field }) => {
                  const { onChange, value, name, ref } = field
                  return (
                    <Select
                      name={name}
                      ref={ref}
                      options={contentProviders}
                      value={contentProviders.find((c) => c.id === value)}
                      onChange={(option) => onChange(option?.id)}
                      getOptionValue={(option) => option.id}
                      getOptionLabel={(option) => option.displayName}
                      placeholder="Choose Content Provider"
                      isClearable
                      isSearchable
                      isDisabled
                    />
                  )
                }}
              />
            </CCol>
          ) : (
            <></>
          )}

          <CCol className="text-center  py-2" xs={12}>
            <CButton
              onClick={() => history.goBack()}
              className="col text-center mx-4 px-4"
              color="dark"
            >
              Cancel
            </CButton>
          </CCol>
        </CForm>
      </div>
    </CContainer>
  )
}
export default View
