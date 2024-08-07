import React, { useState, useEffect } from 'react'
import { format, formatISO, parseISO } from 'date-fns'
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
} from '@coreui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as IncomeService from '../../services/IncomeService'
import MonthPicker from './MonthPicker'
import AddInComeModal from './AddInComeModal'
import ComparisonModal from './ComparisonModal'

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
]

const formatDate = (date) => {
  return format(parseISO(date), 'dd-MM-yyyy HH:mm')
}

const Income = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [comparisonModalVisible, setComparisonModalVisible] = useState(false)
  const queryClient = useQueryClient()

  const fetchIncomeData = async ({ queryKey }) => {
    const [, month, year, page, limit] = queryKey
    return IncomeService.getIncomeInMonth(month, year, page, limit)
  }

  const fetchStatsData = async ({ queryKey }) => {
    const [, month, year] = queryKey
    return IncomeService.getStaticsInMonth(month, year)
  }

  const {
    data: dataInMonth,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['fetchIncomeInMonth', selectedMonth, selectedYear, currentPage, itemsPerPage],
    queryFn: fetchIncomeData,
    keepPreviousData: true,
  })

  const {
    data: statsInMonth,
    error: errorStatics,
    isLoading: isLoadingStats,
    isError: isErrorStatics,
  } = useQuery({
    queryKey: ['fetchStaticsInMonth', selectedMonth, selectedYear],
    queryFn: fetchStatsData,
  })

  const [visibleLg, setVisibleLg] = useState(false)
  const [data, setData] = useState([])
  const [currentIdToDelete, setCurrentIdToDelete] = useState(null)
  const [addInComeModalVisible, setAddInComeModalVisible] = useState(false)
  const [newIncome, setNewIncome] = useState({
    source: '',
    amount: 0,
    note: '',
    createdAt: formatISO(new Date()).slice(0, 16),
  })

  const toggleEdit = (dayIndex, incomeIndex) => {
    const updatedData = [...data]
    const itemToEdit = updatedData[dayIndex].incomes[incomeIndex]
    updatedData[dayIndex].incomes[incomeIndex].editing = !itemToEdit.editing
    setData(updatedData)
  }

  const handleSaveEdit = async (dayIndex, incomeIndex) => {
    const updatedData = [...data]
    const item = updatedData[dayIndex].incomes[incomeIndex]

    try {
      await IncomeService.updateIncome(item.id, {
        source: item.source,
        amount: item.amount,
        note: item.note,
        createdAt: item.createdAt,
      })
      updatedData[dayIndex].incomes[incomeIndex] = {
        ...item,
        editing: false,
      }
      setData(updatedData)
      queryClient.invalidateQueries([
        'fetchIncomeInMonth',
        selectedMonth,
        selectedYear,
        currentPage,
        itemsPerPage,
      ])
    } catch (error) {
      console.error('Failed to update item:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await IncomeService.deleteIncome(currentIdToDelete)
      const newData = data
        .map((day) => {
          const updatedIncomes = day.incomes.filter((item) => item._id !== currentIdToDelete)
          return { ...day, incomes: updatedIncomes }
        })
        .filter((day) => day.incomes.length > 0)
      setData(newData)
      if ((currentPage - 1) * itemsPerPage >= newData.length) {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
      }
      setVisibleLg(false)
      queryClient.invalidateQueries([
        'fetchIncomeInMonth',
        selectedMonth,
        selectedYear,
        currentPage,
        itemsPerPage,
      ])
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  const handleChange = (dayIndex, incomeIndex, field, value) => {
    const updatedData = [...data]
    updatedData[dayIndex].incomes[incomeIndex][field] = value
    setData(updatedData)
  }

  const confirmDelete = (id) => {
    setCurrentIdToDelete(id)
    setVisibleLg(true)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleDateChange = (month, year) => {
    setSelectedMonth(month)
    setSelectedYear(year)
    setCurrentPage(1)
    queryClient.invalidateQueries(['fetchIncomeInMonth', month, year, 1, itemsPerPage])
    queryClient.invalidateQueries(['fetchStaticsInMonth', month, year])
  }

  const handleAddIncome = () => {
    setAddInComeModalVisible(true)
  }

  const handleNewIncomeChange = (field, value) => {
    setNewIncome((prevState) => ({
      ...prevState,
      [field]: value,
    }))
  }

  const handleSaveNewIncome = async () => {
    try {
      await IncomeService.createIncome({
        source: newIncome.source,
        amount: newIncome.amount,
        note: newIncome.note,
        time: new Date(newIncome.createdAt).toISOString(),
      })
      queryClient.invalidateQueries([
        'fetchIncomeInMonth',
        selectedMonth,
        selectedYear,
        currentPage,
        itemsPerPage,
      ])
      setAddInComeModalVisible(false)
      setNewIncome({
        source: '',
        amount: 0,
        note: '',
        createdAt: formatISO(new Date()).slice(0, 16),
      })
    } catch (error) {
      console.error('Failed to add new income:', error)
    }
  }

  const openComparisonModal = () => {
    setComparisonModalVisible(true)
  }

  const closeComparisonModal = () => {
    setComparisonModalVisible(false)
  }

  const handleDownloadReport = async () => {
    try {
      const response = await IncomeService.downloadReport(selectedMonth, selectedYear)
      const url = window.URL.createObjectURL(new Blob([response]))
      const a = document.createElement('a')
      a.href = url
      a.download = `Income_Report_${selectedMonth}_${selectedYear}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.error('Failed to download report:', error)
    }
  }

  useEffect(() => {
    if (dataInMonth && dataInMonth.data) {
      setData(
        dataInMonth.data.map((item) => ({
          ...item,
          incomes: item.incomes.map((income) => ({
            ...income,
            id: income._id,
            source: income.source,
            amount: income.amount,
            note: income.note,
            createdAt: income.createdAt
              ? format(parseISO(income.createdAt), "yyyy-MM-dd'T'HH:mm")
              : 'Invalid Date',
            displayDate: income.createdAt ? formatDate(income.createdAt) : 'Invalid Date',
            editing: false,
          })),
          totalEarned: item.totalEarned || 0,
        })),
      )
    }
  }, [dataInMonth])

  if (isLoading || isLoadingStats) return <div>Loading...</div>
  if (isError || isErrorStatics) return <div>Error: {error.message || errorStatics.message}</div>

  const totalPages = dataInMonth?.totalPages || 0
  const displayedData = data || []

  return (
    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', width: '100%' }}>
      <h3 style={{ textAlign: 'center' }}>Thống kê thu nhập</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <MonthPicker
          onDateChange={handleDateChange}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
        <div>Tổng thu nhập: ${statsInMonth?.currentMonth?.total?.toFixed(2) || '0.00'}</div>
        <CButton color="primary" onClick={handleAddIncome}>
          Thêm nguồn thu nhập
        </CButton>
        <CButton color="success" onClick={handleDownloadReport}>
          Tải về báo cáo
        </CButton>
      </div>
      {!data || data.length === 0 ? (
        <div>Không có dữ liệu.</div>
      ) : (
        <div style={{ flex: 7 }}>
          {displayedData.map((day, dayIndex) => (
            <div key={day._id.day + '-' + day._id.month + '-' + day._id.year}>
              <h5>
                Ngày {day._id.day}/{day._id.month}/{day._id.year} - Tổng cộng: $
                {day.totalEarned?.toFixed(2) || '0.00'}
              </h5>
              <CTable style={{ width: '100%', tableLayout: 'fixed' }}>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                      STT
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                      Nguồn
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                      Ghi chú
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                      Số tiền
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                      Ngày
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ width: '15%', textAlign: 'center', padding: '8px' }}>
                      Thao tác
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {day.incomes.map((row, incomeIndex) => (
                    <CTableRow key={row.id}>
                      <CTableDataCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                        {incomeIndex + 1}
                      </CTableDataCell>
                      <CTableDataCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                        {row.editing ? (
                          <CFormSelect
                            value={row.source}
                            onChange={(e) =>
                              handleChange(dayIndex, incomeIndex, 'source', e.target.value)
                            }
                          >
                            <option value="">Chọn nguồn thu nhập</option>
                            {categories.map((category, index) => (
                              <option key={index} value={category}>
                                {category}
                              </option>
                            ))}
                          </CFormSelect>
                        ) : (
                          row.source
                        )}
                      </CTableDataCell>
                      <CTableDataCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                        {row.editing ? (
                          <CFormInput
                            value={row.note}
                            onChange={(e) =>
                              handleChange(dayIndex, incomeIndex, 'note', e.target.value)
                            }
                          />
                        ) : (
                          row.note
                        )}
                      </CTableDataCell>
                      <CTableDataCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                        {row.editing ? (
                          <CFormInput
                            type="number"
                            value={row.amount}
                            onChange={(e) =>
                              handleChange(
                                dayIndex,
                                incomeIndex,
                                'amount',
                                parseFloat(e.target.value),
                              )
                            }
                          />
                        ) : (
                          `$${row.amount ? row.amount.toFixed(2) : '0.00'}`
                        )}
                      </CTableDataCell>
                      <CTableDataCell style={{ width: '20%', textAlign: 'left', padding: '8px' }}>
                        {row.editing ? (
                          <CFormInput
                            type="datetime-local"
                            value={row.createdAt}
                            onChange={(e) =>
                              handleChange(dayIndex, incomeIndex, 'createdAt', e.target.value)
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
                              onClick={() => handleSaveEdit(dayIndex, incomeIndex)}
                            >
                              Lưu
                            </CButton>
                            <CButton
                              color="secondary"
                              onClick={() => toggleEdit(dayIndex, incomeIndex)}
                            >
                              Hủy
                            </CButton>
                          </>
                        ) : (
                          <>
                            <CButton
                              color="primary"
                              onClick={() => toggleEdit(dayIndex, incomeIndex)}
                            >
                              Sửa
                            </CButton>
                            <CButton color="danger" onClick={() => confirmDelete(row.id)}>
                              Xóa
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
                Trước
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
                Sau
              </CPaginationItem>
            </CPagination>
          )}
          <CModal visible={visibleLg} onClose={() => setVisibleLg(false)}>
            <CModalHeader>
              <CModalTitle>Xác nhận xóa</CModalTitle>
            </CModalHeader>
            <CModalBody>Bạn có chắc chắn muốn xóa nguồn thu nhập này?</CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisibleLg(false)}>
                Hủy
              </CButton>
              <CButton color="danger" onClick={handleDelete}>
                Xóa
              </CButton>
            </CModalFooter>
          </CModal>
        </div>
      )}
      <CCard style={{ marginTop: '20px' }}>
        <CCardHeader style={{ textAlign: 'center' }}>Thống kê tháng</CCardHeader>
        <CCardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h5>Tháng hiện tại</h5>
              <div>Tổng thu nhập: ${statsInMonth?.currentMonth?.total?.toFixed(2) || 'N/A'}</div>
              <div>
                Nguồn thu nhập cao nhất: $
                {statsInMonth?.currentMonth?.maxIncome?.amount?.toFixed(2) || 'N/A'} -{' '}
                {statsInMonth?.currentMonth?.maxIncome?.source}
              </div>
              <div>
                Loại thu nhập cao nhất: {statsInMonth?.currentMonth?.maxCategory?.category || 'N/A'}
              </div>
            </div>
            <div>
              <h5>Tháng trước</h5>
              <div>Tổng thu nhập: ${statsInMonth?.previousMonth?.total?.toFixed(2) || 'N/A'}</div>
              <div>
                Nguồn thu nhập cao nhất: $
                {statsInMonth?.previousMonth?.previousmaxIncome?.amount?.toFixed(2) || 'N/A'} -{' '}
                {statsInMonth?.previousMonth?.previousmaxIncome?.source}
              </div>
              <div>
                Loại thu nhập cao nhất:{' '}
                {statsInMonth?.previousMonth?.previousmaxCategory?.category || 'N/A'}
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
      <AddInComeModal
        visible={addInComeModalVisible}
        onClose={() => setAddInComeModalVisible(false)}
        onSave={handleSaveNewIncome}
        income={newIncome}
        onIncomeChange={handleNewIncomeChange}
      />
      <div style={{ flex: 1 }}></div>
    </div>
  )
}

export default Income
