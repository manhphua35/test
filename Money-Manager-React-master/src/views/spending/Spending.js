/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { format, formatISO, parseISO } from 'date-fns';
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CModalTitle,
  CPagination,
  CPaginationItem,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as SpendingService from '../../services/SpendingService';
import MonthPicker from './MonthPicker';
import AddActivityModal from './AddActivityModal';
import ComparisonModal from './ComparisonModal';

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
];

const formatDate = (date) => {
  return format(parseISO(date), 'dd-MM-yyyy HH:mm');
};

const Spending = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [comparisonModalVisible, setComparisonModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const fetchSpendingData = async ({ queryKey }) => {
    const [, month, year, page, limit] = queryKey;
    return SpendingService.getSpendingInMonth(month, year, page, limit);
  };

  const fetchStatsData = async ({ queryKey }) => {
    const [, month, year] = queryKey;
    return SpendingService.getStaticsInMonth(month, year);
  };

  const {
    data: dataInMonth,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['fetchSpendingInMonth', selectedMonth, selectedYear, currentPage, itemsPerPage],
    queryFn: fetchSpendingData,
    keepPreviousData: true,
  });

  const {
    data: statsInMonth,
    error: errorStatics,
    isLoading: isLoadingStats,
    isError: isErrorStatics,
  } = useQuery({
    queryKey: ['fetchStaticsInMonth', selectedMonth, selectedYear],
    queryFn: fetchStatsData,
  });

  const [visibleLg, setVisibleLg] = useState(false);
  const [data, setData] = useState([]);
  const [currentIdToDelete, setCurrentIdToDelete] = useState(null);
  const [addActivityModalVisible, setAddActivityModalVisible] = useState(false);
  const [newActivity, setNewActivity] = useState({
    note: '',
    action: '',
    prices: 0,
    createdAt: formatISO(new Date()).slice(0, 16), // format for input datetime-local
  });

  const toggleEdit = (dayIndex, activityIndex) => {
    const updatedData = [...data];
    const itemToEdit = updatedData[dayIndex].activities[activityIndex];
    updatedData[dayIndex].activities[activityIndex].editing = !itemToEdit.editing;
    setData(updatedData);
  };

  const handleSaveEdit = async (dayIndex, activityIndex) => {
    const updatedData = [...data];
    const item = updatedData[dayIndex].activities[activityIndex];

    try {
      await SpendingService.updateSpending(item.id, {
        action: item.category,
        prices: item.price,
        note: item.name,
        createdAt: item.createdAt,
      });
      updatedData[dayIndex].activities[activityIndex] = {
        ...item,
        editing: false,
      };
      setData(updatedData);
      window.location.reload(); // Tải lại trang sau khi cập nhật thành công
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await SpendingService.deleteSpending(currentIdToDelete);
      const newData = data
        .map((day) => {
          const updatedActivities = day.activities.filter((item) => item._id !== currentIdToDelete);
          return { ...day, activities: updatedActivities };
        })
        .filter((day) => day.activities.length > 0);
      setData(newData);
      if ((currentPage - 1) * itemsPerPage >= newData.length) {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
      }
      setVisibleLg(false);
      queryClient.invalidateQueries([
        'fetchSpendingInMonth',
        selectedMonth,
        selectedYear,
        currentPage,
        itemsPerPage,
      ]);
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleChange = (dayIndex, activityIndex, field, value) => {
    const updatedData = [...data];
    updatedData[dayIndex].activities[activityIndex][field] = value;
    setData(updatedData);
  };

  const confirmDelete = (id) => {
    setCurrentIdToDelete(id);
    setVisibleLg(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDateChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setCurrentPage(1); 
    queryClient.invalidateQueries(['fetchSpendingInMonth', month, year, 1, itemsPerPage]);
    queryClient.invalidateQueries(['fetchStaticsInMonth', month, year]);
  };

  const handleAddActivity = () => {
    setAddActivityModalVisible(true);
  };

  const handleNewActivityChange = (field, value) => {
    setNewActivity((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSaveNewActivity = async () => {
    try {
      await SpendingService.createSpending({
        action: newActivity.action,
        prices: newActivity.prices,
        note: newActivity.note,
        time: new Date(newActivity.createdAt).toISOString(), // Ensure the correct timezone is saved
      });
      queryClient.invalidateQueries([
        'fetchSpendingInMonth',
        selectedMonth,
        selectedYear,
        currentPage,
        itemsPerPage,
      ]);
      setAddActivityModalVisible(false);
      setNewActivity({
        note: '',
        action: '',
        prices: 0,
        createdAt: formatISO(new Date()).slice(0, 16), // Reset to current date and time
      });
    } catch (error) {
      console.error('Failed to add new activity:', error);
    }
  };

  const openComparisonModal = () => {
    setComparisonModalVisible(true);
  };

  const closeComparisonModal = () => {
    setComparisonModalVisible(false);
  };

  const handleDownloadReport = async () => {
    try {
      const response = await SpendingService.downloadReport(selectedMonth, selectedYear);
      const url = window.URL.createObjectURL(new Blob([response]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `Spending_Report_${selectedMonth}_${selectedYear}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  useEffect(() => {
    if (dataInMonth && dataInMonth.data) {
      setData(
        dataInMonth.data.map((item) => ({
          ...item,
          activities: item.activities.map((activity) => ({
            ...activity,
            id: activity._id,
            name: activity.note,
            category: activity.action,
            price: activity.prices,
            createdAt: activity.createdAt
              ? format(parseISO(activity.createdAt), "yyyy-MM-dd'T'HH:mm")
              : 'Invalid Date',
            displayDate: activity.createdAt ? formatDate(activity.createdAt) : 'Invalid Date',
            editing: false,
          })),
        })),
      );
    }
  }, [dataInMonth]);

  useEffect(() => {
  }, [dataInMonth, statsInMonth]);

  if (isLoading || isLoadingStats) return <div>Loading...</div>;
  if (isError || isErrorStatics) return <div>Error: {error.message || errorStatics.message}</div>;

  const totalPages = dataInMonth?.totalPages || 0;
  const displayedData = data || [];

  return (
    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', width: '100%' }}>
      <h3 style={{ textAlign: 'center' }}>Thống kê chi tiêu</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <MonthPicker onDateChange={handleDateChange} selectedMonth={selectedMonth} selectedYear={selectedYear} />
        <div>Tổng chi tiêu: ${statsInMonth?.currentMonth?.total?.toFixed(2) || '0.00'}</div>
        <CButton color="primary" onClick={handleAddActivity}>
          Thêm hoạt động
        </CButton>
        <CButton color="success" onClick={handleDownloadReport}>
          Tải về báo cáo
        </CButton>
      </div>
      {(!data || data.length === 0) ? (
        <div>Không có dữ liệu.</div>
      ) : (
        <div style={{ flex: 7 }}>
          {displayedData.map((day, dayIndex) => (
            <div key={day._id.day + '-' + day._id.month + '-' + day._id.year}>
              <h5>
                Ngày {day._id.day}/{day._id.month}/{day._id.year} - Tổng cộng: $
                {day.totalSpent?.toFixed(2) || '0.00'}
              </h5>
              <CTable style={{ width: '100%', tableLayout: 'fixed' }}>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                      STT
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                      Note
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                      Category
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                      Price
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                      Date
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '15%', textAlign: 'center', padding: '8px' }}>
                      Actions
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {day.activities.map((row, activityIndex) => (
                    <CTableRow key={row.id}>
                      <CTableDataCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                        {activityIndex + 1}
                      </CTableDataCell>
                      <CTableDataCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                        {row.editing ? (
                          <CFormInput
                            value={row.name}
                            onChange={(e) =>
                              handleChange(dayIndex, activityIndex, 'name', e.target.value)
                            }
                          />
                        ) : (
                          row.name
                        )}
                      </CTableDataCell>
                      <CTableDataCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                        {row.editing ? (
                          <CFormSelect
                            value={row.category}
                            onChange={(e) =>
                              handleChange(dayIndex, activityIndex, 'category', e.target.value)
                            }
                          >
                            <option value="">Chọn loại hoạt động</option>
                            {categories.map((category, index) => (
                              <option key={index} value={category}>
                                {category}
                              </option>
                            ))}
                          </CFormSelect>
                        ) : (
                          row.category
                        )}
                      </CTableDataCell>
                      <CTableDataCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                        {row.editing ? (
                          <CFormInput
                            type="number"
                            value={row.price}
                            onChange={(e) =>
                              handleChange(
                                dayIndex,
                                activityIndex,
                                'price',
                                parseFloat(e.target.value),
                              )
                            }
                          />
                        ) : (
                          `$${row.price?.toFixed(2)}`
                        )}
                      </CTableDataCell>
                      <CTableDataCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                        {row.editing ? (
                          <CFormInput
                            type="datetime-local"
                            value={row.createdAt}
                            onChange={(e) =>
                              handleChange(dayIndex, activityIndex, 'createdAt', e.target.value)
                            }
                          />
                        ) : (
                          row.displayDate
                        )}
                      </CTableDataCell>
                      <CTableDataCell style={{ width: '15%', textAlign: 'center', padding: '8px' }}>
                        {row.editing ? (
                          <>
                            <CButton
                              color="primary"
                              onClick={() => handleSaveEdit(dayIndex, activityIndex)}
                            >
                              Save
                            </CButton>
                            <CButton
                              color="secondary"
                              onClick={() => toggleEdit(dayIndex, activityIndex)}
                            >
                              Cancel
                            </CButton>
                          </>
                        ) : (
                          <>
                            <CButton
                              color="primary"
                              onClick={() => toggleEdit(dayIndex, activityIndex)}
                            >
                              Edit
                            </CButton>
                            <CButton color="danger" onClick={() => confirmDelete(row.id)}>
                              Delete
                            </CButton>
                          </>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          ))}
          {totalPages > 1 && (
            <CPagination align="center" aria-label="Page navigation example">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </CPaginationItem>
              {[...Array(totalPages).keys()].map((page) => (
                <CPaginationItem
                  key={page + 1}
                  active={currentPage === page + 1}
                  onClick={() => handlePageChange(page + 1)}
                >
                  {page + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </CPaginationItem>
            </CPagination>
          )}
          <CModal visible={visibleLg} onClose={() => setVisibleLg(false)}>
            <CModalHeader>
              <CModalTitle>Xác nhận xóa</CModalTitle>
            </CModalHeader>
            <CModalBody>Bạn có chắc chắn muốn xóa hoạt động này?</CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisibleLg(false)}>
                Cancel
              </CButton>
              <CButton color="danger" onClick={handleDelete}>
                Delete
              </CButton>
            </CModalFooter>
          </CModal>
        </div>
      )}
      <CCard style={{ marginTop: '20px' }}>
        <CCardHeader style={{ textAlign: 'center' }}>Monthly Statistics</CCardHeader>
        <CCardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h5>Tháng hiện tại</h5>
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
          <CButton color="primary" onClick={openComparisonModal}>
            Xem chi tiết
          </CButton>
        </CCardBody>
      </CCard>
      <ComparisonModal
        visible={comparisonModalVisible}
        onClose={closeComparisonModal}
        statsInMonth={statsInMonth}
      />
      <AddActivityModal
        visible={addActivityModalVisible}
        onClose={() => setAddActivityModalVisible(false)}
        onSave={handleSaveNewActivity}
        activity={newActivity}
        onActivityChange={handleNewActivityChange}
      />
      <div style={{ flex: 1 }}></div>
    </div>
  );
};

export default Spending;
