import { useState } from "react";
import styles from './Myapp.module.css';
import dayjs from 'dayjs';

const today = dayjs();

function getDaysInMonth(dateObj) {
  const days = [];
  const startDate = dayjs(dateObj).startOf("month");
  const daysInMonth = startDate.daysInMonth();
  for (let i = 0; i < daysInMonth; i++) {
    days.push(startDate.add(i, "day"))
  }
  return days;
}

function createEntityData(initialDate){
  const entityData = [];
  for (let i = 0; i < 3; i++) {
    const curDate = initialDate.add(i, 'day');
    const curObj = {
      'label': `num${i}`,
      'date': curDate.format("MM-DD-YYYY"),
      'img': `coolpic${i}`,
      'id': i
    }
    entityData.push(curObj);
  }
  return entityData
}

function Myapp() {
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [activeDate, setCurrentDate] = useState(today);

  const toggleCalendar = () => {
    setIsCalendarExpanded(prev => !prev);
  }

  const days = getDaysInMonth(activeDate);
  const firstDay = days[0];
  const firstDayColumn = firstDay.day() + 1;

  const entityData = createEntityData(activeDate);
  const fields =  Object.keys(entityData[0]);

  return <>
    <div className={styles.header}>
      <div className={styles.appHeader}>
        <div className={styles.appHeaderLeft}>
          <div className={styles.hamburger}>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className={styles.monthArrow} onClick={toggleCalendar}>
            <div>{activeDate.format("MMMM")}</div>
            <svg
              className={`${styles.arrow} ${isCalendarExpanded ? styles.arrowExpanded : ""}`}
              viewBox="0 0 10 10" width="10" height="10">
              <polygon points="0,0 10,5 0,10" fill="black" />
            </svg>
          </div>
        </div>
        <div className={styles.appHeaderRight}>
          <div className={styles.pfp}></div>
        </div>
      </div>
      {isCalendarExpanded && (
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
                  onClick={() => setCurrentDate(day)}
                >
                  {day.date()}
                </div>
              ))}
          </div>
        </div>
      )}
      <div className={styles.entityLabelRow}>
        <div className={styles.cell}></div>
        {entityData.map(entity => (
          <div className={styles.cell} key={entity.id}>{entity.date}</div>
        ))}
      </div>
    </div>
    <div className="body">
      {fields.map(field => (
        <div key={field} className={styles.entityRow}>
          <div className={styles.cell}>{field}</div>
          {entityData.map(entity => (
            <div key={`${entity['id']}.${field}`} className={styles.cell}>{entity[field]}</div>
          ))}
        </div>
      ))}
      <div className={styles.entityRow}>
        <div className={styles.cell}>
          add new field
        </div>
        {entityData.map(entity => (
          <div className={styles.cell}></div>
        ))}
      </div>
    </div>
  </>
}

export default Myapp