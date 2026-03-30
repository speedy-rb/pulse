import styles from './DayColumn.module.css';

function DayColumn({ topRowHeight, addNewRowHeight, isCalendarExpanded, fieldRows, dayData }) {
  const gridTemplateRows = [topRowHeight, ...fieldRows.map(row => row.height), addNewRowHeight]
    .join(" ");
  return (
    <div
      style = {{
        display: 'grid',
        gridTemplateRows
      }}
    >
      <div className={`${styles.dayHeaderContainer} ${
        isCalendarExpanded ? styles.dayHeaderContainerCalendarExpanded : ""
      }`}>
        <div className={styles.dayHeaderWeekDay}>{dayData.dateObj.format('ddd').toUpperCase()}</div>
        <div className={styles.dayHeaderDay}>{dayData.dateObj.date()}</div>
      </div>
      { fieldRows.map((row, i) => (
        <div key={i} className={styles.cell}>
          {row.key === 'img'
            ? <img
                src={dayData[row.key]}
                height='100%'
              />
            : <div>
                {dayData[row.key]}
              </div>
          }
        </div>
        ))
      }
      <div className={styles.cell}>.</div>
    </div>      
  )
}

export default DayColumn;