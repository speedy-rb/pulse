import { useState } from "react";
import styles from './Myapp.module.css';
import dayjs from 'dayjs';
import Calendar from './Calendar/Calendar';
import ThreeDayContentGrid from './ThreeDayContentGrid/ThreeDayContentGrid';

const today = dayjs();
function Myapp() {
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [activeDate, setActiveDate] = useState(today);

  const toggleCalendar = () => {
    setIsCalendarExpanded(prev => !prev);
  }

  return (
    <div className={styles.appShell}>
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
            <img src='pfp-64-64.png' className={styles.pfp} />
          </div>
        </div>
        {isCalendarExpanded && (
          <Calendar
            activeDate={activeDate}
            setActiveDate={setActiveDate}
          />
        )}
      </div>
      <ThreeDayContentGrid
        activeDate={activeDate}
        isCalendarExpanded={isCalendarExpanded} // conditionally change background color of header
      />
    </div>
  )
}

export default Myapp