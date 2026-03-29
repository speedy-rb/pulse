import { useState } from "react";
import styles from './ThreeDayContentGrid.module.css';
import DayColumn from '../DayColumn/DayColumn';
import StoryFieldLabelCol from '../StoryFieldLabelCol/StoryFieldLabelCol';

function createEntityData(initialDate){
  const entityData = [];
  for (let i = 0; i < 3; i++) {
    const curDate = initialDate.add(i, 'day');
    const curObj = {
      'id': i,
      'img': `ref_story_${i}.jpg`,
      'notes': `post ${i} details`,
      'date': curDate.format("MM-DD-YYYY"),
      'dateObj': curDate
    }
    entityData.push(curObj);
  }
  return entityData
}

function ThreeDayContentGrid({ activeDate, isCalendarExpanded }) {
  const entityData = createEntityData(activeDate);
  const topRowHeight = '50px';
  const addNewRowHeight = '100px';
  const fieldRows = [
    { key: "img", label: "img", height: '200px'},
    // { key: "date", label: "date", height: '50px'},
    { key: "id", label: "id", height: '30px'},
    { key: "notes", label: "notes", height: '120px'},
  ]

  return (
    <div className={styles.threeDayContentGrid}>
      <StoryFieldLabelCol
        topRowHeight={topRowHeight}
        addNewRowHeight={addNewRowHeight}
        fieldRows={fieldRows}
        isCalendarExpanded={isCalendarExpanded}
      />
      <div className={styles.dayDataViewport}>
        <div className={styles.dayDataTrack}>
          <DayColumn
            topRowHeight={topRowHeight}
            isCalendarExpanded={isCalendarExpanded}
            fieldRows={fieldRows}
            dayData={entityData[0]}
          />
          <DayColumn
            topRowHeight={topRowHeight}
            isCalendarExpanded={isCalendarExpanded}
            fieldRows={fieldRows}
            dayData={entityData[1]}
          />
          <DayColumn
            topRowHeight={topRowHeight}
            isCalendarExpanded={isCalendarExpanded}
            fieldRows={fieldRows}
            dayData={entityData[2]}
          />
        </div>
      </div>
    </div>
  )
}

export default ThreeDayContentGrid;