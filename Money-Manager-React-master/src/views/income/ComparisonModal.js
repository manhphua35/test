/* eslint-disable prettier/prettier */
import React from 'react'
import { CModal, CModalBody, CModalHeader, CModalFooter, CModalTitle, CButton } from '@coreui/react'

const ComparisonModal = ({ visible, onClose, statsInMonth }) => {
  const currentMonth = statsInMonth?.currentMonth
  const previousMonth = statsInMonth?.previousMonth

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Comparison Modal</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h5>Tháng hiện tại</h5>
        <div>Tổng thu nhập: ${currentMonth?.total?.toFixed(2) || '0.00'}</div>
        <div>
          Hoạt động thu nhiều nhất: ${currentMonth?.maxIncome?.amount?.toFixed(2) || 'N/A'} -{' '}
          {currentMonth?.maxIncome?.source || 'N/A'}
        </div>
        <div>Lĩnh vực thu nhiều nhất: {currentMonth?.maxCategory?.category || 'N/A'}</div>
        <h5>Tháng trước</h5>
        <div>Tổng thu nhập: ${previousMonth?.total?.toFixed(2) || '0.00'}</div>
        <div>
          Hoạt động thu nhiều nhất: ${previousMonth?.previousmaxIncome?.amount?.toFixed(2) || 'N/A'}{' '}
          - {previousMonth?.previousmaxIncome?.source || 'N/A'}
        </div>
        <div>Lĩnh vực thu nhiều nhất: {previousMonth?.previousmaxCategory?.category || 'N/A'}</div>
        <div>Chênh lệch: ${statsInMonth?.difference?.toFixed(2) || '0.00'}</div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ComparisonModal
