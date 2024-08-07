/* eslint-disable prettier/prettier */
import axios from 'axios'

export const createIncome = async (data) => {
  try {
    console.log(data)
    const res = await axios.post(`${process.env.REACT_APP_API_BACKEND}/income/create`, data, {
      withCredentials: true,
    })
    return res.data
  } catch (error) {
    console.error('Error during the creation process:', error)
    throw error
  }
}

export const updateIncome = async (id, data) => {
  try {
    const res = await axios.put(`${process.env.REACT_APP_API_BACKEND}/income/update/${id}`, data, {
      withCredentials: true,
    })
    return res.data
  } catch (error) {
    console.error('Error during the update process:', error)
    throw error
  }
}

export const deleteIncome = async (id) => {
  const res = await axios.delete(`${process.env.REACT_APP_API_BACKEND}/income/delete/${id}`, {
    withCredentials: true,
  })
  return res.data
}

export const getIncomeInMonth = async (month, year, page, itemsPerPage) => {
  const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/income/getIncomeInMonth`, {
    params: {
      month,
      year,
      page,
      itemsPerPage,
    },
    withCredentials: true,
  })
  return res.data
}

// Other service functions...

export const getStaticsInMonth = async (month, year) => {
  const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/income/getStaticsInMonth?month=${month}&year=${year}`, { withCredentials: true })
  return res.data
}

export const getchart = async (data) => {
  const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/income/getchart`, data)
  return res.data
}

export const downloadReport = async (month, year) => {
  const response = await axios.get(`${process.env.REACT_APP_API_BACKEND}/income/report/download`, {
    params: { month, year },
    responseType: 'blob',
  });
  return response.data;
};
