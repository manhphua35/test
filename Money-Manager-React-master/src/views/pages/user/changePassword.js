import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { cilLockLocked, cilArrowLeft } from '@coreui/icons'
import * as UserService from '../../../services/UserService'

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const navigate = useNavigate()

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu mới và xác nhận mật khẩu không khớp')
      return
    }

    try {
      const response = await UserService.changePassword({ oldPassword, newPassword })
      if (response.status === 'OK') {
        setSuccessMessage('Mật khẩu đã được thay đổi thành công!')
        setErrorMessage(null)
        setTimeout(() => {
          setSuccessMessage(null)
          navigate('/dashboard')
        }, 3000)
      } else {
        setErrorMessage(response.message || 'Có lỗi xảy ra khi đổi mật khẩu!')
      }
    } catch (error) {
      setErrorMessage(error.message || 'Có lỗi xảy ra khi kết nối tới server!')
    }
  }

  const handleBackToHome = () => {
    navigate('/dashboard')
  }

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={9} lg={7} xl={6}>
          <CCard className="mx-4">
            <CCardBody className="p-4">
              <CForm>
                <CRow className="mb-3">
                  <CCol xs="auto">
                    <CButton color="primary" onClick={handleBackToHome} size="sm">
                      <CIcon icon={cilArrowLeft} size="sm" /> Trang chủ
                    </CButton>
                  </CCol>
                  <CCol>
                    <h1>Đổi Mật Khẩu</h1>
                  </CCol>
                </CRow>
                {successMessage && <CAlert color="success">{successMessage}</CAlert>}
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Mật khẩu cũ"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </CInputGroup>
                <div className="d-grid gap-2">
                  <CButton color="success" onClick={handleChangePassword}>
                    Đổi Mật Khẩu
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ChangePassword
