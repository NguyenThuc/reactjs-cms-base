import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CSpinner,
} from '@coreui/react'
import { SingleErrorMessage } from '../../../common/custom-error-message/CustomErrorMessage'
import { Controller, useForm, useWatch } from 'react-hook-form'
import Select from 'react-select/creatable'
import { P_USERS_LIST } from '../../../constant'
import { array, number, object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import userServices from '../../../services/user.service'
import userService from '../../../services/user.service'
import { ModalConfirmContext } from '../../../common/context/ModalConfirmContext'

const Edit = () => {
  const history = useHistory()
  const id = history.location.search.split('=')[1]
  const [userData, setUserData] = useState({
    roles: [],
  })
  const [roles, setRoles] = useState([])
  const [showCp, setShowCp] = useState(false)
  const [contentProviders, setContentProviders] = useState([])
  const { setModalVisible, setModalConfig } = React.useContext(ModalConfirmContext)

  const atLeastOneRequireCp = (lstRoles) => {
    let atLeastOneRequireCp = false
    if (Array.isArray(lstRoles) && lstRoles.length > 0) {
      lstRoles.forEach((roleName) => {
        if (roles.find((roleAPI) => roleAPI.name === roleName).requireCp) {
          atLeastOneRequireCp = true
        }
      })
    }
    return atLeastOneRequireCp
  }

  const schema = object().shape({
    displayName: string().required('Display name is required').max(100),
    roles: array().min(1, 'You must choose at least 1 role'),
    cpId: number()
      .required('Content provider is required')
      .when('roles', (roles, schema) => {
        return roles.length > 0 && atLeastOneRequireCp(roles)
          ? schema.typeError('Content provider is required')
          : schema.notRequired()
      }),
  })

  const {
    handleSubmit,
    control,
    register,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  })

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

  const onHandleSubmit = (formData) => {
    setModalVisible(true)
    setModalConfig({
      title: {
        header: 'Add',
        body: 'Are you sure you want update this data ?',
        footer: {
          confirm: 'Yes',
          cancel: 'No',
        },
      },
      onConfirm: () => {
        userService.updateBasicInfo(userData.id, formData).then(() => {
          history.push(P_USERS_LIST)
        })
      },
    })
  }
  return (
    <CContainer className="col-8">
      <div className="form-control">
        <CForm className="g-3 needs-validation" onSubmit={handleSubmit(onHandleSubmit)}>
          <h2 className="text-center py-2"> Update User</h2>

          <CCol className="col-md-12 px-5 py-2">
            <CFormLabel>Display name *</CFormLabel>
            <CFormInput {...register('displayName')} />
            <SingleErrorMessage name="displayName" errors={errors} />
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
                inline
                key={role.id}
                label={role.displayName}
                value={role.name}
                {...register('roles')}
              />
            ))}
            <SingleErrorMessage name="roles" errors={errors} />
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
                    />
                  )
                }}
              />
              <SingleErrorMessage name="cpId" errors={errors} />
            </CCol>
          ) : (
            <></>
          )}

          <CCol className="text-center  py-2" xs={12}>
            <CButton
              disabled={isSubmitting}
              className="col text-center mx-4 px-4"
              color="success"
              type="submit"
            >
              {isSubmitting && <CSpinner component="span" size="sm" aria-hidden="true" />}
              Submit
            </CButton>
            <CButton
              onClick={() => history.push(P_USERS_LIST)}
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
export default Edit
