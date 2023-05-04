import React, { useEffect, useState } from 'react'
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
import { Controller, useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { array, number, object, ref, string } from 'yup'
import { SingleErrorMessage } from '../../../common/custom-error-message/CustomErrorMessage'
import userServices from '../../../services/user.service'
import userService from '../../../services/user.service'
import Select from 'react-select/creatable'
import { useHistory } from 'react-router-dom'
import { P_USERS_LIST } from '../../../constant'
import { ModalConfirmContext } from '../../../common/context/ModalConfirmContext'

export function Add() {
  const history = useHistory()
  const ROLE_CONTENT_PROVIDER = 'ROLE_CP'
  const schema = object().shape({
    userName: string()
      .required('Username is required')
      .min(4)
      .max(50)
      .matches(/^\S+$/, 'Space is not allowed for this field'),
    displayName: string().required('Display name is required').max(100),
    email: string().required('Email is required').email(),
    password: string().required('Password is required'),
    confirmPassword: string()
      .transform((x) => (x === '' ? undefined : x))
      .when('password', (password, schema) => {
        if (password) return schema.required('Confirm Password is required')
      })
      .oneOf([ref('password')], 'Must match with password'),
    roles: array().min(1, 'You must choose at least 1 role'),
    cpId: number()
      .required('Content provider is required')
      .when('roles', (roles, schema) => {
        return roles.length > 0 && roles.some((r) => JSON.parse(r).requireCp)
          ? schema.typeError('Content provider is required')
          : schema.notRequired()
      }),
  })

  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [roles, setRoles] = useState([])
  const [contentProviders, setContentProviders] = useState([])
  const [showCp, setShowCp] = useState(false)
  const { setModalVisible, setModalConfig } = React.useContext(ModalConfirmContext)

  useEffect(() => {
    userServices.getRoles().then((response) => {
      const rolesData = response.data
      setRoles(rolesData)
      rolesData.forEach((data) => {
        if (data.name === ROLE_CONTENT_PROVIDER && data.requireCp) {
          setShowCp(true)
        }
      })
    })
    userServices.getContentProviders().then((response) => {
      setContentProviders(response.data)
    })
  }, [])

  const rolesWatched = useWatch({
    control,
    name: 'roles',
    defaultValue: [],
  })

  useEffect(() => {
    const rolesWatchedCloned = [...rolesWatched]
    if (rolesWatchedCloned.length === 0) {
      setShowCp(false)
      return
    }
    let atLeastOneRequireCp = false
    rolesWatchedCloned.forEach((roleWatched) => {
      if (JSON.parse(roleWatched).requireCp) {
        atLeastOneRequireCp = true
      }
    })
    if (!atLeastOneRequireCp) {
      setValue('cpId', undefined)
    }
    setShowCp(atLeastOneRequireCp)
  }, [rolesWatched])

  const onHandleSubmit = (data) => {
    setModalVisible(true)
    setModalConfig({
      title: {
        header: 'Add',
        body: 'Are you sure adding new data ?',
        footer: {
          confirm: 'Yes',
          cancel: 'No',
        },
      },
      onConfirm: () => {
        data.roles = data.roles.map((item) => JSON.parse(item).name)
        userService.addUser(data).then(
          () => {
            history.push(P_USERS_LIST)
          },
          () => {
            setValue('confirmPassword', undefined, { shouldValidate: true })
          },
        )
      },
    })
  }

  return (
    <CContainer className="col-8">
      <div className="form-control">
        <CForm className="g-3 needs-validation" onSubmit={handleSubmit(onHandleSubmit)}>
          <h2 className="text-center py-2"> Register User</h2>

          <CCol className="col-md-12 px-5 py-2">
            <CFormLabel>User name *</CFormLabel>

            <CFormInput {...register('userName')} />
            <SingleErrorMessage name="userName" errors={errors} />
          </CCol>

          <CCol className="col-md-12 px-5 py-2">
            <CFormLabel>Display name *</CFormLabel>
            <CFormInput {...register('displayName')} />
            <SingleErrorMessage name="displayName" errors={errors} />
          </CCol>
          <CCol className="col-md-12 px-5 py-2">
            <CFormLabel>Email *</CFormLabel>
            <CFormInput {...register('email')} />
            <SingleErrorMessage name="email" errors={errors} />
          </CCol>
          <CCol className="col-md-12 px-5 py-2">
            <CFormLabel>Password *</CFormLabel>
            <CFormInput {...register('password')} />
            <SingleErrorMessage name="password" errors={errors} />
          </CCol>

          <CCol className="col-md-12 px-5 py-2">
            <CFormLabel>Confirm Password *</CFormLabel>
            <CFormInput {...register('confirmPassword')} />
            <SingleErrorMessage name="confirmPassword" errors={errors} />
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
                value={JSON.stringify({ name: role.name, requireCp: role.requireCp })}
                defaultChecked={role.name === ROLE_CONTENT_PROVIDER}
                {...register('roles')}
              />
            ))}
            <SingleErrorMessage name="roles" errors={errors} />
          </CCol>

          {showCp ? (
            <CCol className="col-md-12 px-5 py-2">
              <CFormLabel>Content provider*</CFormLabel>
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

export default Add
