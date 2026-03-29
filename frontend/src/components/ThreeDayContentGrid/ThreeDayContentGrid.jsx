import { useState } from "react";
import styles from './ThreeDayContentGrid.module.css';
import dayjs from 'dayjs';

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

function ThreeDayContentGrid({ activeDate, isCalendarExpanded }) {
  const entityData = createEntityData(activeDate);
  const fieldsToShow =  ['label','date','img','id'];

  return ( <>
    <div className={styles.body}>
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
  )
}

export default ThreeDayContentGrid;