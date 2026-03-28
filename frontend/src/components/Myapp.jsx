import { useState } from "react";
import styles from './Myapp.module.css';
import dayjs from 'dayjs';
import Calendar from './Calendar/Calendar';

function createEntityData(initialDate){
  const entityData = [];
  for (let i = 0; i < 3; i++) {
    const curDate = initialDate.add(i, 'day');
    const curObj = {
      'label': `num${i}`,
      'date': curDate.format("MM-DD-YYYY"),
      'dateObj': curDate,
      'img': `coolpic${i}`,
      'id': i
    }
    entityData.push(curObj);
  }
  return entityData
}

const today = dayjs();
function Myapp() {
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [activeDate, setActiveDate] = useState(today);

  const toggleCalendar = () => {
    setIsCalendarExpanded(prev => !prev);
  }

  const entityData = createEntityData(activeDate);
  const fieldsToShow =  ['label','date','img','id'];

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
          <img src='pfp-64-64.png' className={styles.pfp} />
        </div>
      </div>
      {isCalendarExpanded && (
        <Calendar
          activeDate={activeDate}
          setActiveDate={setActiveDate}
        />
      )}
      <div className={`${styles.entityLabelRow} ${
          isCalendarExpanded ? styles.entityLabelRowExpanded : ""
        }`}>
        <div className={styles.cell}></div>
        {entityData.map(entity => (
          <div className={styles.cell} key={entity.id}>
            <div className={styles.dayHeaderContainer}>
              <div className={styles.dayHeaderWeekDay}>{entity.dateObj.format('ddd').toUpperCase()}</div>
              <div className={styles.dayHeaderDay}>{entity.dateObj.date()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="body">
      {fieldsToShow.map(field => (
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
        {entityData.map((entity, i) => (
          <div className={styles.cell} key={i}></div>
        ))}
      </div>
    </div>
  </>
}

export default Myapp