import { useState } from "react";
import styles from './Calendar.module.css';
import dayjs from 'dayjs';
import MonthGrid from '../MonthGrid/MonthGrid';

function Calendar({ activeDate, setActiveDate }) {
  return (
    <MonthGrid
      activeDate={activeDate}
      setActiveDate={setActiveDate}
    />
  )
}

export default Calendar;