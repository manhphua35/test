/* eslint-disable prettier/prettier */
import axios from 'axios'

export const SignInUser = async (data) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_BACKEND}/user/login`, data, {
      withCredentials: true,
    })
    return res.data
  } catch (error) {
    console.error('Error during the login process:', error)
    throw error
  }
}

export const LogoutUser = async () => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_BACKEND}/user/logout`,
    {},
    {
      withCredentials: true,
    },
  )
  return res.data
}

export const SignUpUser = async (data) => {
  const res = await axios.post(`${process.env.REACT_APP_API_BACKEND}/user/register`, data)
  console.log(res)
  return res.data
}

export const getUserData = async() =>{
  const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/user/profile`,{
    withCredentials: true,
  },)
  return res.data
}

export const updateUserData = async(data) =>{
  const res = await axios.post(`${process.env.REACT_APP_API_BACKEND}/user/updateUserData`,data,{
    withCredentials: true,
  },)
  return res.data
}

export const changePassword = async(data) =>{
  const res = await axios.post(`${process.env.REACT_APP_API_BACKEND}/user/changePassword`,data,{
    withCredentials: true,
  },)
  return res.data
}