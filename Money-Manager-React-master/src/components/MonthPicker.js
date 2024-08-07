/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'

const DatePicker = ({ onDateChange }) => {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const handleMonthChange = (e) => {
    const newMonth = e.target.value
    setMonth(newMonth)
    onDateChange(newMonth, year)
  }

  const handleYearChange = (e) => {
    const newYear = e.target.value
    setYear(newYear)
    onDateChange(month, newYear)
  }

  return (
    <div>
      <select value={month} onChange={handleMonthChange}>
        {[...Array(12).keys()].map((m) => (
          <option key={m + 1} value={m + 1}>
            {m + 1}
          </option>
        ))}
      </select>
      <input type="number" value={year} onChange={handleYearChange} />
    </div>
  )
}

export default DatePicker
