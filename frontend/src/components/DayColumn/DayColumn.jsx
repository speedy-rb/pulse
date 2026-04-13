import dayjs from 'dayjs';
import styles from './DayColumn.module.css';

function DayColumn({
    topRowHeight,
    addNewRowHeight,
    isCalendarExpanded,
    fieldRows,
    dayData,
    fieldDataViewportRef,
    setIsEditPostExpanded,
  }) {
  const dateObj = dayjs(dayData.post_date);
  const bodyGridTemplateRows = [
    ...fieldRows.map(row => row.height), addNewRowHeight]
    .join(" ");
  const isNoData = dayData.id ? false : true;
  const openEditPost = () => setIsEditPostExpanded(true);
  function renderCellContent(row) {
    if (row.key === 'image_path') {
      if (isNoData) {
        return (
          <button
            className={styles.createPostBtn}
            onClick={openEditPost}
          >
            Create Post
          </button>
        )
      }
      return (
        <img
          src={`/uploads${dayData[row.key]}`}
          height='100%'
        />
      )
    }
    return <div>{dayData[row.key]}</div>
  }
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
        <div className={styles.dayHeaderWeekDay}>{dateObj.format('ddd').toUpperCase()}</div>
        <div className={styles.dayHeaderDay}>{dateObj.date()}</div>
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
              {renderCellContent(row)}
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