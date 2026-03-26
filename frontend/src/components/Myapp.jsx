import { useState } from "react";
import styles from './Myapp.module.css';

const entityData = [
  {
    'label': 'num1',
    'date': "2026-03-27",
    'img': 'coolpic',
    'id': 1
  },
  {
    'label': 'num2',
    'date': "2026-03-26",
    'img': 'coolpic2',
    'id': 2
  }
]
const fields =  Object.keys(entityData[0]);
function Myapp() {
    return <>
      <div className={styles.header}>
        <div className={styles.appHeader}>
          <div className={styles.appHeaderLeft}>
            <div>hamburger</div>
            <div>month</div>
          </div>
          <div className={styles.appHeaderRight}>
            <div>profile</div>
          </div>
        </div>
        <div className={styles.entityLabelHeader}>
          {entityData.map(entity => (
            <div key={entity.id}>{entity.label}</div>
          ))}
        </div>
      </div>
      <div className="body">
        {fields.map(field => (
          <div key={field} className={styles.entityRow}>
            <div>{field}</div>
            {entityData.map(entity => (
              <div key={`${entity['id']}.${field}`}>{entity[field]}</div>
            ))}
          </div>
        ))}
        <div className={styles.entityRow}>
          add new field
        </div>
      </div>
    </>
}

export default Myapp