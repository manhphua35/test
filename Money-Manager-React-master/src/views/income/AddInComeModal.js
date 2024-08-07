import React, { useEffect } from 'react';
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
} from '@coreui/react';
import { formatISO } from 'date-fns';

const categories = [
  'Cho thuê',
  'Quyên góp',
  'Cổ tức',
  'Hoàn tiền',
  'Tiền lương',
  'Bán hàng',
  'Tiền thưởng',
  'Phiếu giảm giá',
  'Khác',
];

const AddInComeModal = ({ visible, onClose, onSave, income, onIncomeChange }) => {
  useEffect(() => {
    if (visible && !income.createdAt) {
      onIncomeChange('createdAt', formatISO(new Date()).slice(0, 16));
    }
  }, [visible]);

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Thêm nguồn thu nhập mới</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div style={{ marginBottom: '10px' }}>
          <CFormLabel>Nguồn</CFormLabel>
          <CFormSelect
            value={income.source || ''}
            onChange={(e) => onIncomeChange('source', e.target.value)}
          >
            <option value="">Chọn nguồn thu nhập</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </CFormSelect>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <CFormLabel>Ghi chú</CFormLabel>
          <CFormInput
            value={income.note || ''}
            onChange={(e) => onIncomeChange('note', e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <CFormLabel>Số tiền</CFormLabel>
          <CFormInput
            type="number"
            value={income.amount || ''}
            onChange={(e) => onIncomeChange('amount', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <CFormLabel>Ngày</CFormLabel>
          <CFormInput
            type="datetime-local"
            value={income.createdAt || formatISO(new Date()).slice(0, 16)}
            onChange={(e) => onIncomeChange('createdAt', e.target.value)}
          />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Hủy
        </CButton>
        <CButton color="primary" onClick={onSave}>
          Lưu
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default AddInComeModal;
