import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutationHooks } from '../../../hooks/useMutationHook'
import * as UserService from '../../../services/UserService'
import {
  CButton,
  CCard,
  CCardBody,
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


const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}

const Register = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [countdown, setCountdown] = useState(5)


  useEffect(() => {
    const userId = getCookie('userId')
    if (userId && userId !== 'undefined') {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleChangeEmail = (event) => {
    setEmail(event.target.value)
  }

  const handleChangePassword = (event) => {
    setPassword(event.target.value)
  }

  const handleChangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value)
  }

  const handleChangeName = (event) => {
    setName(event.target.value)
  }

  const handleChangePhoneNumber = (event) => {
    setPhoneNumber(event.target.value)
  }

  const handleNavigateSignIn = () => {
    navigate('/login')
  }

  const mutation = useMutationHooks(UserService.SignUpUser)

  const { mutate, data, isSuccess, isError, error: mutationError } = mutation

  useEffect(() => {
    let interval
    let timeout

    if (isSuccess && data?.status === 'OK') {
      setSuccess(`Đăng ký thành công! Chuyển sang trang đăng nhập sau ${countdown} giây...`)
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            return prev - 1
          } else {
            clearInterval(interval)
            return 0
          }
        })
      }, 1000)

      timeout = setTimeout(handleNavigateSignIn, 5000) // Chuyển sang trang đăng nhập sau 5 giây
    } else if (isError) {
      setError(mutationError?.response?.data?.message || 'Đăng ký thất bại')
    }

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [isSuccess, isError, data, mutationError])

  const handleSignUp = () => {
    setError(null) // Clear previous error message
    setSuccess(null) // Clear previous success message
    setCountdown(5) // Reset countdown
    mutate({ email, password, confirmPassword, name, phoneNumber })
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Tạo tài khoản</h1>
                  <p className="text-body-secondary">Hãy tạo tài khoản của bạn để bắt đầu</p>
                  {error && (
                    <CAlert color="danger" className="mt-3" style={{ fontSize: '0.875rem' }}>
                      {error}
                    </CAlert>
                  )}
                  {success && (
                    <CAlert color="success" className="mt-3" style={{ fontSize: '0.875rem' }}>
                      Đăng ký thành công! Chuyển sang trang đăng nhập sau {countdown} giây...
                    </CAlert>
                  )}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Tên" autoComplete="name" onChange={handleChangeName} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Số điện thoại"
                      autoComplete="phoneNumber"
                      onChange={handleChangePhoneNumber}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      onChange={handleChangeEmail}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Mật khẩu"
                      autoComplete="new-password"
                      onChange={handleChangePassword}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Xác nhận mật khẩu"
                      autoComplete="new-password"
                      onChange={handleChangeConfirmPassword}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" onClick={handleSignUp}>
                      Tạo tài khoản
                    </CButton>
                  </div>
                  <div className="text-center mt-3">
                    <p>
                      Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </p>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
