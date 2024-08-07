import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import * as UserService from '../../../services/UserService'
import { useMutationHooks } from '../../../hooks/useMutationHook'
import { loginSuccess } from '../../../redux/actions/userActions'

const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('') // State để lưu trữ thông báo lỗi
  const [success, setSuccess] = useState('') // State để lưu trữ thông báo thành công
  const [countdown, setCountdown] = useState(5) // State để đếm ngược
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const mutation = useMutationHooks(UserService.SignInUser)

  const { data, isLoading, isSuccess, isError, error: mutationError } = mutation

  useEffect(() => {
    const userId = getCookie('userId')
    if (userId && userId !== 'undefined') {
      navigate('/dashboard')
    }
  }, [navigate])


  useEffect(() => {
    if (isSuccess && data.status === 'OK') {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)

      const timeout = setTimeout(() => {
        navigate('/dashboard')
      }, 5000)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    } else if (isError) {
      setError(mutationError.response?.data?.message || 'Đã có lỗi xảy ra')
    }
  }, [isSuccess, isError, data, mutationError, navigate, dispatch])

  useEffect(() => {
    if (countdown >= 0 && isSuccess && data.status === 'OK') {
      setSuccess(`Đăng nhập thành công! Chuyển sang trang dashboard sau ${countdown} giây...`)
    }
  }, [countdown, isSuccess, data])

  const handleChangeEmail = (event) => {
    setEmail(event.target.value)
  }

  const handleChangePassword = (event) => {
    setPassword(event.target.value)
  }

  const handleSignIn = (event) => {
    event.preventDefault()
    setError('') // Xóa thông báo lỗi trước đó
    setSuccess('') // Xóa thông báo thành công trước đó
    setCountdown(5) // Đặt lại countdown
    mutation.mutate({
      email,
      password,
    })
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Đăng nhập</h1>
                    <p className="text-body-secondary">Đăng nhập vào tài khoản của bạn</p>
                    {error && (
                      <CAlert color="danger" className="mt-3">
                        {error}
                      </CAlert>
                    )}
                    {success && (
                      <CAlert color="success" className="mt-3">
                        {success}
                      </CAlert>
                    )}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="username"
                        onChange={handleChangeEmail}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Mật khẩu"
                        autoComplete="current-password"
                        onChange={handleChangePassword}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={handleSignIn}>
                          Đăng nhập
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Quên mật khẩu?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Đăng ký</h2>
                    <p>
                      Đăng ký tài khoản để học cách quản lý tài chính một cách khoa học và hiệu quả nhất
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Đăng ký ngay!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
