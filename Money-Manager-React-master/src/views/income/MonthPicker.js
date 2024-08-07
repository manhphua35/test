/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import enUS from 'date-fns/locale/en-US'

registerLocale('en', enUS)

const MonthPicker = ({ onDateChange, selectedMonth, selectedYear }) => {
  const [selectedDate, setSelectedDate] = useState(new Date(selectedYear, selectedMonth - 1))

  const handleDateChange = (date) => {
    setSelectedDate(date)
    const selectedMonth = date.getMonth() + 1
    const selectedYear = date.getFullYear()
    onDateChange(selectedMonth, selectedYear)
  }

  useEffect(() => {
    const initialMonth = selectedDate.getMonth() + 1
    const initialYear = selectedDate.getFullYear()
    onDateChange(initialMonth, initialYear)
  }, [])

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      dateFormat="MM/yyyy"
      showMonthYearPicker
      locale="en"
      className="form-control"
    />
  )
}

export default MonthPicker
