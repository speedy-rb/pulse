import styles from './StoryFieldLabelCol.module.css';

function StoryFieldLabelCol({
  topRowHeight,
  addNewRowHeight,
  fieldRows,
  isCalendarExpanded,
  fieldLabelsViewportRef,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
 }) {
  const bodyGridTemplateRows = [
    ...fieldRows.map(row => row.height), addNewRowHeight]
    .join(" ");
  return (
    <div
      className={styles.storyFieldLabelCol}
      style={{
        display: 'grid',
        gridTemplateRows: `${topRowHeight} minmax(0, 1fr)`
      }}
    >
      <div className={`${styles.deadZone} ${
        isCalendarExpanded ? styles.deadZoneCalendarExpanded : ""
      }`}></div>
      <div
        ref={fieldLabelsViewportRef}
        className={styles.fieldLabelsViewport}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          className={styles.fieldLabelsGrid}
          style={{
            display:'grid',
            gridTemplateRows: bodyGridTemplateRows
          }}
        >
          {fieldRows.map((field, i) => (
            <div key={i} className={styles.cell}>
              {field.label}
            </div>
          ))}
          <div className={styles.cell}>Add new field</div>
        </div>
      </div>
    </div>
  )
}

export default StoryFieldLabelCol;