import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilAccountLogout, cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useCookies } from 'react-cookie'
import * as UserService from '../../services/UserService'
import { useNavigate } from 'react-router-dom'
import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const [cookies] = useCookies(['userId'])
  const navigate = useNavigate()
  const isLoggedIn = cookies.userId

  const handleLogout = async () => {
    await UserService.LogoutUser()
    navigate('/login')
  }

  const handleProfile = () => {
    navigate('/profile')
  }

  const handleChangePassword = () =>{
    navigate('/changePassword')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        {isLoggedIn ? (
          <>
            <CDropdownHeader className="bg-body-secondary fw-semibold my-2">
              Menu
            </CDropdownHeader>
            <CDropdownItem onClick={handleProfile}>
              <CIcon icon={cilUser} className="me-2" />
              Thông tin
            </CDropdownItem>
            <CDropdownItem onClick={handleChangePassword}>
              <CIcon icon={cilSettings} className="me-2" />
              Đổi mật khẩu
            </CDropdownItem>
            <CDropdownDivider />
            <CDropdownItem onClick={handleLogout}>
              <CIcon icon={cilAccountLogout} className="me-2" />
              Log Out
            </CDropdownItem>
          </>
        ) : (
          <>
            <CDropdownHeader className="bg-body-secondary fw-semibold my-2">
              Login Required
            </CDropdownHeader>
            <CDropdownItem href="/login">
              <CIcon icon={cilUser} className="me-2" />
              Log In
            </CDropdownItem>
          </>
        )}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
