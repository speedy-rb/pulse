import styles from './DayColumn.module.css';

function DayColumn({
    topRowHeight,
    addNewRowHeight,
    isCalendarExpanded,
    fieldRows,
    dayData,
    fieldDataViewportRef,
  }) {
  const bodyGridTemplateRows = [
    ...fieldRows.map(row => row.height), addNewRowHeight]
    .join(" ");
  return (
    <div
      className={styles.dayColumn}
      style = {{
        display: 'grid',
        gridTemplateRows: `${topRowHeight} minmax(0, 1fr)`
      }}
    >
      <div className={`${styles.dayHeaderContainer} ${
        isCalendarExpanded ? styles.dayHeaderContainerCalendarExpanded : ""
      }`}>
        <div className={styles.dayHeaderWeekDay}>{dayData.dateObj.format('ddd').toUpperCase()}</div>
        <div className={styles.dayHeaderDay}>{dayData.dateObj.date()}</div>
      </div>
      <div
        ref={fieldDataViewportRef}
        className={styles.fieldDataViewport}
      >
        <div
          className={styles.fieldDataGrid}
          style={{
            display: 'grid',
            gridTemplateRows: bodyGridTemplateRows
          }}
        >
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
      </div>
    </div>      
  )
}

export default DayColumn;