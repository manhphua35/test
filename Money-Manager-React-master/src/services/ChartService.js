/* eslint-disable prettier/prettier */
import axios from 'axios';

export const getChartSpendingInMonth = async (month, year) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/chart/getChartSpendingInMonth`, {
      params: { month, year },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('Error during fetching chart in month:', error);
    throw error;
  }
};

export const getChartCompareSpending = async (month, year) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/chart/getChartCompareSpending`, {
      params: { month, year },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('Error during fetching chart compare:', error);
    throw error;
  }
};

export const getChartIncomeInMonth = async (month, year) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/chart/getChartIncomeInMonth`, {
        params: { month, year },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error('Error during fetching chart in month:', error);
      throw error;
    }
  };
  
  export const getChartCompareIncome = async (month, year) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/chart/getChartCompareIncome`, {
        params: { month, year },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error('Error during fetching chart compare:', error);
      throw error;
    }
  };

export const getCompareInMonth = async (month, year) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/chart/getCompareInMonth`, {
      params: { month, year },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('Error during fetching compare in month:', error);
    throw error;
  }
};
