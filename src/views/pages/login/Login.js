import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibLetsEncrypt,
  cilFolder,
  cilGem,
  cilHeart,
  cilListRich,
  cilLockLocked,
  cilUser,
} from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../../actions/auth'
import './Login.css'
import backGroundLogin from '../../../assets/images/signin-bg-1.jpg'
import logoBig from '../../../assets/images/logo-big.png'
//import castisBrand from '../../../assets/brand/castis-brand.png'
import { LoadCanvasTemplate, loadCaptchaEnginge, validateCaptcha } from 'react-simple-captcha'
import { useForm } from 'react-hook-form'
import { SingleErrorMessage } from '../../../common/custom-error-message/CustomErrorMessage'
import { mixed, object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const Login = () => {
  const schema = object().shape({
    userName: string().required('Username is required!'),
    password: string().required('Password is required!'),
    captcha: mixed()
      .test('required', 'Captcha is required!', (value) => {
        return value && value.length
      })
      .test('validCaptcha', 'Captcha is invalid!', (value) => {
        const isValid = validateCaptcha(value)
        if (!isValid) {
          loadCaptchaEnginge(6)
        }
        return isValid
      }),
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCaptchaEnginge(6)
  }, [])

  const { isLoggedIn } = useSelector((state) => state.userReducer.auth)

  const dispatch = useDispatch()

  const handleLogin = (data) => {
    const { userName, password } = data
    setLoading(true)
    dispatch(login(userName, password))
      .then(() => {
        return <Redirect to="/dashboard" />
      })
      .catch(() => {
        setLoading(false)
      })
  }

  if (isLoggedIn && localStorage.getItem('user') != null) {
    return <Redirect to="/dashboard" />
  }

  return (
    <>
      <div className="page-signIn-bg">
        <div className="overlay" />
        <CImage src={backGroundLogin} />
      </div>
      <div className="min-vh-100 signIn-container" style={{ marginTop: '80px' }}>
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={6}>
              <CRow>
                <CCard className="text-white p-4 signIn-info col-md-5">
                  <CCardBody className="clearfix" title="">
                    <div>
                      <CImage
                        style={{
                          color: '#fff',
                          fontSize: '22px',
                          fontWeight: '700',
                          opacity: 1,
                        }}
                        src={logoBig}
                      />
                    </div>
                    <div
                      style={{
                        color: '#fff',
                        fontSize: '18px',
                        fontWeight: '200',
                        marginTop: '8px',
                      }}
                    >
                      Content Management System &nbsp;
                      <font size={1}>
                        <i>Ver.1.1.1 (2021-10-25)</i>
                      </font>
                    </div>
                    <ul>
                      <li>
                        <CIcon icon={cilGem} size={'sm'} />
                        &nbsp; Say it your way
                      </li>
                      <li>
                        <CIcon icon={cilFolder} size={'sm'} />
                        &nbsp; Content Management
                      </li>
                      <li>
                        <CIcon icon={cilListRich} size={'sm'} />
                        &nbsp; Realtime Contents Service
                      </li>

                      <li>
                        <CIcon icon={cilHeart} size={'sm'} />
                        &nbsp; Easy to service
                      </li>
                    </ul>
                  </CCardBody>
                </CCard>
                <CCard className="p-4 col-md-7">
                  <CCardBody>
                    <CForm onSubmit={handleSubmit(handleLogin)}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Username"
                          autoComplete="userName"
                          {...register('userName')}
                        />
                        <SingleErrorMessage name="userName" errors={errors} />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Password"
                          autoComplete="password"
                          {...register('password')}
                        />
                        <SingleErrorMessage name="password" errors={errors} />
                      </CInputGroup>

                      <div className="mb-2">
                        <LoadCanvasTemplate reloadText={'&#x21bb;'} reloadColor={'black'} />
                      </div>

                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cibLetsEncrypt} />
                        </CInputGroupText>
                        <CFormInput {...register('captcha')} />
                        <SingleErrorMessage name="captcha" errors={errors} />
                      </CInputGroup>

                      <CRow>
                        <CCol xs={12} style={{ textAlignLast: 'center' }}>
                          <CButton
                            type="submit"
                            shape="rounded-pill"
                            style={{
                              backgroundColor: '#1d89cf',
                              borderColor: '#1d89cf',
                            }}
                            className="px-4"
                            disabled={loading}
                          >
                            {loading && <CSpinner component="span" size="sm" aria-hidden="true" />}
                            Login
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CRow>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Login
