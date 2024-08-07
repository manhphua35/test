/* eslint-disable prettier/prettier */
import React from 'react'
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CModalTitle,
  CButton,
  CFormInput,
  CFormSelect,
  CFormLabel,
} from '@coreui/react'
import { formatISO } from 'date-fns'

const categories = [
  'Ăn uống',
  'Quần áo',
  'Hoa quả',
  'Mua sắm',
  'Giao thông',
  'Nhà ở',
  'Du lịch',
  'Rượu và đồ uống',
  'Chi phí điện nước',
  'Quà',
  'Giáo dục',
  'Rau',
  'Đồ ăn vặt',
  'Chi phí điện thoại',
  'Trẻ sơ sinh',
  'Thể thao',
  'Thuế',
  'Kỹ thuật số',
  'Sức khỏe',
  'Giải trí',
  'Ô tô',
  'Xã hội',
  'Bảo hiểm',
  'Văn phòng',
  'Sách',
  'Làm đẹp',
]

const AddActivityModal = ({ visible, onClose, onSave, activity, onActivityChange }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Thêm hoạt động mới</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div style={{ marginBottom: '10px' }}>
          <CFormLabel>Note</CFormLabel>
          <CFormInput
            value={activity.note || ''}
            onChange={(e) => onActivityChange('note', e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <CFormLabel>Category</CFormLabel>
          <CFormSelect
            value={activity.action || ''}
            onChange={(e) => onActivityChange('action', e.target.value)}
          >
            <option value="">Chọn loại hoạt động</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </CFormSelect>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <CFormLabel>Price</CFormLabel>
          <CFormInput
            type="number"
            value={activity.prices || ''}
            onChange={(e) => onActivityChange('prices', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <CFormLabel>Date</CFormLabel>
          <CFormInput
            type="datetime-local"
            value={activity.createdAt || formatISO(new Date()).slice(0, 16)}
            onChange={(e) => onActivityChange('createdAt', e.target.value)}
          />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={onSave}>
          Save
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default AddActivityModal
