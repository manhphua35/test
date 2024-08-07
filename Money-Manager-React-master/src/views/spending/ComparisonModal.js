import React from 'react';
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CModalTitle,
  CButton,
} from '@coreui/react';

const ComparisonModal = ({ visible, onClose, statsInMonth }) => {
  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>So sánh chi tiêu giữa hai tháng</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h5>Tháng hiện tại</h5>
            {Object.entries(statsInMonth?.currentMonth?.summary || {}).map(([category, value]) => (
              <div key={category}>
                {category}: ${value.toFixed(2)}
              </div>
            ))}
            <div>Tổng chi tiêu: ${statsInMonth?.currentMonth?.total?.toFixed(2) || 'N/A'}</div>
            <div>
              Hoạt động chi nhiều nhất: ${statsInMonth?.currentMonth?.maxExpense?.amount?.toFixed(2) || 'N/A'} - {statsInMonth?.currentMonth?.maxExpense?.activity}
            </div>
            <div>
              Lĩnh vực chi nhiều nhất: {statsInMonth?.currentMonth?.maxCategory?.category || 'N/A'}
            </div>
          </div>
          <div>
            <h5>Tháng trước</h5>
            {Object.entries(statsInMonth?.previousMonth?.summary || {}).map(([category, value]) => (
              <div key={category}>
                {category}: ${value.toFixed(2)}
              </div>
            ))}
            <div>Tổng chi tiêu: ${statsInMonth?.previousMonth?.total?.toFixed(2) || 'N/A'}</div>
            <div>
              Hoạt động chi nhiều nhất: ${statsInMonth?.previousMonth?.previousmaxExpense?.amount?.toFixed(2) || 'N/A'} - {statsInMonth?.previousMonth?.previousmaxExpense?.activity}
            </div>
            <div>
              Lĩnh vực chi nhiều nhất: {statsInMonth?.previousMonth?.previousmaxCategory?.category || 'N/A'}
            </div>
          </div>
        </div>
        <div>Chênh lệch: ${statsInMonth?.difference?.toFixed(2) || '0.00'}</div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ComparisonModal;
