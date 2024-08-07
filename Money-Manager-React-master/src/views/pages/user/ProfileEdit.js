/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
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
import { cilUser, cilPhone, cilEnvelopeOpen, cilArrowLeft } from '@coreui/icons'
import * as UserService from '../../../services/UserService'

const ProfileEdit = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch user information and set the state
    const fetchUserData = async () => {
      const userData = await UserService.getUserData()
      setName(userData.data.name || '')
      setEmail(userData.data.email || '')
      setPhone(userData.data.phone || '')
    }
    fetchUserData()
  }, [])

  const handleSave = async () => {
    const updatedUser = { name, email, phone }
    const response = await UserService.updateUserData(updatedUser)
    if (response.status === 'OK') {
      setSuccessMessage('Thông tin đã được cập nhật thành công!')
      setTimeout(() => {
        setSuccessMessage(null)
        window.location.reload()
      }, 3000)
    } else {
      alert('Có lỗi xảy ra khi cập nhật thông tin!')
    }
  }

  const handleCancel = () => {
    window.location.reload() // Refresh the page to reload original data
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
                    <h1>Chỉnh sửa thông tin cá nhân</h1>
                  </CCol>
                </CRow>
                {successMessage && (
                  <CAlert color="success">
                    {successMessage}
                  </CAlert>
                )}
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilEnvelopeOpen} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </CInputGroup>
                <div className="d-grid gap-2">
                  <CButton color="success" onClick={handleSave}>
                    Lưu
                  </CButton>
                  <CButton color="danger" onClick={handleCancel}>
                    Huỷ
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

export default ProfileEdit
