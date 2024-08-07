/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react';
import { CChartBar } from '@coreui/react-chartjs';
import { DocsCallout } from 'src/components';
import * as ChartService from '../../services/ChartService';
import MonthPicker from './MonthPicker';

const Charts = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [spendingInMonth, setSpendingInMonth] = useState({});
  const [incomeInMonth, setIncomeInMonth] = useState({});
  const [compareSpending, setCompareSpending] = useState({});
  const [compareIncome, setCompareIncome] = useState({});
  const [compareInMonth, setCompareInMonth] = useState({});

  const fetchData = async (month, year) => {
    try {
      const spendingResponse = await ChartService.getChartSpendingInMonth(month, year);
      const incomeResponse = await ChartService.getChartIncomeInMonth(month, year);
      const compareSpendingResponse = await ChartService.getChartCompareSpending(month, year);
      const compareIncomeResponse = await ChartService.getChartCompareIncome(month, year);
      const compareInMonthResponse = await ChartService.getCompareInMonth(month, year);

      setSpendingInMonth(spendingResponse);
      setIncomeInMonth(incomeResponse);
      setCompareSpending(compareSpendingResponse);
      setCompareIncome(compareIncomeResponse);
      setCompareInMonth(compareInMonthResponse);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    fetchData(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const formatBarChartData = (data, label) => {
    if (!data || typeof data !== 'object') {
      return {
        labels: [],
        datasets: [
          {
            label,
            backgroundColor: '#f87979',
            data: [],
          },
        ],
      };
    }

    // Loại bỏ các mục không cần thiết
    const filteredData = Object.keys(data)
      .filter(key => key !== 'status' && key !== 'message')
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    // Dịch các nhãn sang tiếng Việt
    const labels = Object.keys(filteredData).map((key) => {
      switch (key) {
        case 'currentMonthTotal': return 'Tổng tháng hiện tại';
        case 'previousMonthTotal': return 'Tổng tháng trước';
        case 'difference': return 'Chênh lệch';
        default: return key;
      }
    });

    return {
      labels,
      datasets: [
        {
          label,
          backgroundColor: '#f87979',
          data: Object.values(filteredData),
        },
      ],
    };
  };

  return (
    <CRow>
      <CCol xs={12} style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Biểu đồ thống kê</h1>
      </CCol>
      <CCol xs={12} style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <MonthPicker
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onDateChange={(month, year) => {
            setSelectedMonth(month);
            setSelectedYear(year);
          }}
        />
      </CCol>
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardHeader>Chi tiêu trong tháng</CCardHeader>
          <CCardBody>
            <CChartBar
              data={formatBarChartData(spendingInMonth.categoryAmounts, 'Chi tiêu trong tháng')}
              labels="categories"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardHeader>Thu nhập trong tháng</CCardHeader>
          <CCardBody>
            <CChartBar
              data={formatBarChartData(incomeInMonth.categoryAmounts, 'Thu nhập trong tháng')}
              labels="categories"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardHeader>So sánh chi tiêu</CCardHeader>
          <CCardBody>
            <CChartBar
              data={formatBarChartData(compareSpending, 'So sánh chi tiêu')}
              labels="months"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardHeader>So sánh thu nhập</CCardHeader>
          <CCardBody>
            <CChartBar
              data={formatBarChartData(compareIncome, 'So sánh thu nhập')}
              labels="months"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Thu nhập so với Chi tiêu</CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: ['Thu nhập', 'Chi tiêu'],
                datasets: [
                  {
                    label: 'Thu nhập so với Chi tiêu',
                    backgroundColor: ['#36A2EB', '#FF6384'],
                    data: [compareInMonth.totalIncome, compareInMonth.totalSpending],
                  },
                ],
              }}
              labels="categories"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Charts;
