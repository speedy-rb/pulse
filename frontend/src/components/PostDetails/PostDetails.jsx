import { useState, useEffect } from "react";
import styles from './PostDetails.module.css';

function PostDetails({ setIsViewPostExpanded }) {
  const dateStr = '2026-04-27';
  const [postData, setPostData] = useState(null)
  const [isImageExpanded, setIsImageExpanded] = useState(false)
  useEffect(() => {
    async function getPostData() {
      const res = await fetch(`/api/posts?date=${dateStr}`);
      const  tempData = await res.json();
      console.log('pre setPostData', tempData[0]);
      setPostData(tempData[0]);
      console.log(postData);
      console.log('post setPostData', tempData[0]);
    }
    getPostData();
  }, []);
  useEffect(() => {
    console.log('postData changed:',postData);
  }, [postData]);
  return (
    <div className={styles.viewDetailsContainer}>
      <div className={styles.actionBar}>
        <div
          className={styles.formIconContainer}
          onClick={() => setIsViewPostExpanded(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
          </svg>
        </div>
        <div className={styles.formIconContainer}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
          </svg>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.fieldHeaderRow}>
          <div className={styles.formIconContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z"/>
            </svg>
          </div>
          <div>Reference photo</div>
        </div>
        <div className={styles.fieldWidgetRow}>
          <div className={styles.imageBox}>
            <img
              className={`${styles.refImg} ${
                isImageExpanded ? styles.refImgExpanded: ''
              }`}
              src={`/uploads/${postData?.image_path}`}
              onClick={() => setIsImageExpanded(prev => !prev)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetails;