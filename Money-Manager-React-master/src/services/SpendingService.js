/* eslint-disable prettier/prettier */
import axios from 'axios'

export const createSpending = async (data) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_BACKEND}/spending/create`, data, {
      withCredentials: true,
    })
    return res.data
  } catch (error) {
    console.error('Error during the login process:', error)
    throw error
  }
}

export const updateSpending = async (id,data) => {
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_BACKEND}/spending/update/${id}`, data, {
          withCredentials: true,
        })
        return res.data
      } catch (error) {
        console.error('Error during the login process:', error)
        throw error
      }
}

export const deleteSpending = async (id) => {
  const res = await axios.delete(`${process.env.REACT_APP_API_BACKEND}/spending/delete/${id}`, {
    withCredentials: true
  })
  console.log(res);
  return res.data
}


export const getSpendingInMonth = async (month, year, page, itemsPerPage) => {
  const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/spending/getSpendingInMonth`, {
    params: {
      month,
      year,
      page,
      itemsPerPage,
    },
    withCredentials: true,
  });
  return res.data;
};




export const getStaticsInMonth = async (month, year) => {
    const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/spending/getStaticsInMonth?month=${month}&year=${year}`,{withCredentials: true} )
    return res.data
}

export const getchart = async (data) => {
    const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/spending/getchart`, data)
    return res.data
}

export const downloadReport = async (month, year) => {
  const response = await axios.get(`${process.env.REACT_APP_API_BACKEND}/spending/report/download`, {
    params: { month, year },
    responseType: 'blob', 
  });
  return response.data;
};

