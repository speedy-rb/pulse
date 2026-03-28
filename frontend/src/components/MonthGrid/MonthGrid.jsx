import { useState } from "react";
import styles from './MonthGrid.module.css';
import dayjs from 'dayjs';

function getDaysInMonth(monthObj) {
  const days = [];
  const startDate = dayjs(monthObj).startOf("month");
  const daysInMonth = startDate.daysInMonth();
  for (let i = 0; i < daysInMonth; i++) {
    days.push(startDate.add(i, "day"))
  }
  return days;
}

function MonthGrid({ monthObj, highlightedDate, setActiveDate }) {
  const days = getDaysInMonth(monthObj);
  const firstDay = days[0];
  const firstDayColumn = firstDay.day() + 1;

  return (
    <div className={styles.monthPanel}>
      <div className={styles.calendarHeader}>
        <div className={styles.calendarDayLabelRow}>
          {Array.from(["S", "M", "T", "W", "T", "F", "S"]).map((day, i) => (
            <div key={i} className={styles.calendarDayLabelCell}>{day}</div>
          ))}
        </div>
        <div className={styles.calendarDaysGrid}>
            {days.map((day, i) => (
              <div
                key={day.format("YYYY-MM-DD")}
                className={styles.calendarDaysGridCell}
                style={i === 0 ? { gridColumnStart: firstDayColumn} : undefined}
                onClick={() => setActiveDate(day)}
              >
                <div className={
                  highlightedDate && day.isSame(highlightedDate, "day")
                    ? styles.highlightedCalendarDay
                    : ""
                  }>
                  {day.date()}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default MonthGrid;