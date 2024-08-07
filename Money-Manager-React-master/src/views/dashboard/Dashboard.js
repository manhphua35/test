/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCol, CCardHeader, CRow, CButton } from '@coreui/react';
import { CChartBar } from '@coreui/react-chartjs';
import { useNavigate } from 'react-router-dom';
import * as ChartService from '../../services/ChartService';
import AddActivityModal from '../spending/AddActivityModal';
import AddInComeModal from '../income/AddInComeModal';
import * as spendingService from '../../services/SpendingService';
import * as incomeService from '../../services/IncomeService';

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [spendingInMonth, setSpendingInMonth] = useState({});
  const [incomeInMonth, setIncomeInMonth] = useState({});
  const [addSpendingModalVisible, setAddSpendingModalVisible] = useState(false);
  const [addIncomeModalVisible, setAddIncomeModalVisible] = useState(false);
  const [activity, setActivity] = useState({});
  const [income, setIncome] = useState({});
  const navigate = useNavigate();

  const fetchData = async (month, year) => {
    try {
      const spendingResponse = await ChartService.getChartCompareSpending(month, year);
      const incomeResponse = await ChartService.getChartCompareIncome(month, year);

      setSpendingInMonth(spendingResponse);
      setIncomeInMonth(incomeResponse);
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

    return {
      labels: ['Tổng tháng này', 'Tổng tháng trước', 'Chênh lệch'],
      datasets: [
        {
          label,
          backgroundColor: label.includes('chi tiêu') ? '#f87979' : '#36A2EB',
          data: [data.currentMonthTotal, data.previousMonthTotal, data.difference],
        },
      ],
    };
  };

  const handleActivityChange = (key, value) => {
    setActivity({ ...activity, [key]: value });
  };

  const handleIncomeChange = (key, value) => {
    setIncome({ ...income, [key]: value });
  };

  const handleSaveActivity = async () => {
    try {
      await spendingService.createSpending(activity);
      setAddSpendingModalVisible(false);
      navigate('/spending');
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const handleSaveIncome = async () => {
    try {
      await incomeService.createIncome(income);
      setAddIncomeModalVisible(false);
      navigate('/income');
    } catch (error) {
      console.error('Error saving income:', error);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            Tổng chi tiêu tháng này: {spendingInMonth.currentMonthTotal || 0}
            <CButton color="primary" style={{ marginLeft: '10px' }} onClick={() => setAddSpendingModalVisible(true)}>
              Thêm chi tiêu
            </CButton>
          </div>
          <div>
            Tổng thu nhập tháng này: {incomeInMonth.currentMonthTotal || 0}
            <CButton color="primary" style={{ marginLeft: '10px' }} onClick={() => setAddIncomeModalVisible(true)}>
              Thêm doanh thu
            </CButton>
          </div>
        </div>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Biểu đồ so sánh chi tiêu của 2 tháng</CCardHeader>
          <CCardBody style={{ height: '400px' }}>
            <CChartBar
              data={formatBarChartData(spendingInMonth, 'So sánh chi tiêu')}
              options={{
                scales: {
                  x: { grid: { offset: true } },
                  y: { beginAtZero: true },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Biểu đồ so sánh thu nhập của 2 tháng</CCardHeader>
          <CCardBody style={{ height: '400px' }}>
            <CChartBar
              data={formatBarChartData(incomeInMonth, 'So sánh thu nhập')}
              options={{
                scales: {
                  x: { grid: { offset: true } },
                  y: { beginAtZero: true },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modals for adding spending and income */}
      <AddActivityModal
        visible={addSpendingModalVisible}
        onClose={() => setAddSpendingModalVisible(false)}
        onSave={handleSaveActivity}
        activity={activity}
        onActivityChange={handleActivityChange}
      />
      <AddInComeModal
        visible={addIncomeModalVisible}
        onClose={() => setAddIncomeModalVisible(false)}
        onSave={handleSaveIncome}
        income={income}
        onIncomeChange={handleIncomeChange}
      />
    </CRow>
  );
};

export default Dashboard;
