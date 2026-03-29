import styles from './StoryFieldLabelCol.module.css';

function StoryFieldLabelCol({ topRowHeight, addNewRowHeight, fieldRows, isCalendarExpanded }) {
  const gridTemplateRows = [topRowHeight, ...fieldRows.map(row => row.height), addNewRowHeight]
    .join(" ");
  return (
    <div
      className={styles.storyFieldLabelCol}
      style={{
        display: 'grid',
        gridTemplateRows
      }}
    >
      <div className={`${styles.deadZone} ${
        isCalendarExpanded ? styles.deadZoneCalendarExpanded : ""
      }`}></div>
      {fieldRows.map((field, i) => (
        <div key={i} className={styles.cell}>
          {field.label}
        </div>
      ))}
      <div className={styles.cell}>Add new field</div>
    </div>
  )
}

export default StoryFieldLabelCol;