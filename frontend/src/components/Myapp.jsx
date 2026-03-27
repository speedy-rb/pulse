import { useState } from "react";
import styles from './Myapp.module.css';

const entityData = [
  {
    'label': 'num1',
    'date': "2026-03-26",
    'img': 'coolpic',
    'id': 1
  },
  {
    'label': 'num2',
    'date': "2026-03-27",
    'img': 'coolpic2',
    'id': 2
  },
  {
    'label': 'num3',
    'date': "2026-03-28",
    'img': 'coolpic3',
    'id': 3
  },
]
const fields =  Object.keys(entityData[0]);
function Myapp() {
    return <>
      <div className={styles.header}>
        <div className={styles.appHeader}>
          <div className={styles.appHeaderLeft}>
            <div className={styles.hamburger}>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className={styles.monthArrow}>
              <div>month</div>
              {/* <div className={styles.arrow}>▸</div> */}
              <svg className={styles.arrow} viewBox="0 0 10 10" width="10" height="10">
                <polygon points="0,0 10,5 0,10" fill="black" />
              </svg>
            </div>
          </div>
          <div className={styles.appHeaderRight}>
            <div>profile</div>
          </div>
        </div>
        <div className={styles.entityRow}>
          <div className={styles.cell}></div>
          {entityData.map(entity => (
            <div className={styles.cell} key={entity.id}>{entity.date}</div>
          ))}
        </div>
      </div>

      <div className="body">
        {fields.map(field => (
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
          {entityData.map(entity => (
            <div className={styles.cell}></div>
          ))}
        </div>
      </div>
    </>
}

export default Myapp