import Calendar from '../Calendar/Calendar';
import dayjs from 'dayjs';
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import styles from './PostForm.module.css';

function PostForm({
    handleOverlayPointerDown,
    setIsEditPostExpanded,
  }) {
  // schema of post
    // id
    // image_path
    // post_date
    // location
    // notes
    // created_at
    // updated_at
  const defaultPostData = {
    postDate: null,
    location: '',
    notes: '',
    image: {
      file: null,
      url: '',
    }
  };
  const today = dayjs();
  const [activeDate, setActiveDate] = useState(today);
  const [postData, setPostData] = useState(defaultPostData);
  const hideOverlay = () => setIsEditPostExpanded(false);
  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setPostData(cur => ({
      ...cur,
      image: {
        file: file,
        url: previewUrl,
      }
    }));
  }
  function handleLocationChange(e) {
    setPostData(cur => ({
      ...cur,
      location: e.target.value,
    }));
  }
  useLayoutEffect(() => {
    const el = notesRef.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height=`${el.scrollHeight}px`;
  }, [postData.notes]);
  const notesRef = useRef(null);
  function handleNotesChange(e) {
    const value = e.target.value;
    setPostData(cur => ({
      ...cur,
      notes: value,
    }))
  }
  const isActiveImage = postData.image.url ? true : false;
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  function handleDateClick() {
    setIsCalendarExpanded(cur => !cur);
  }
  return (
    <div className={styles.postFormContainer}>
      {/* Sticky Header */}
      <div className={styles.stickyHeaderPostForm}>
        <button
          onClick={hideOverlay}
        >
          Cancel
        </button>
        <div
          className={styles.stickyHeaderChevronContainer}
          onPointerDown={handleOverlayPointerDown}
        >
          <svg viewBox="0 0 80 20">
            <polyline
              points="10,3 40,10 70,3"
            />
          </svg>
        </div>
        <button>Save</button>
      </div>
      {/* Create Post Header */}
      <div className={styles.titleRow}>
        <div className={styles.formIconContainer}>
          </div>
        <h2>Create Post</h2>
      </div>
      {/* Form */}
      <form className={styles.postForm}>
        {/* Add Photo */}
        <div className={styles.formRow}>
          <div className={styles.fieldHeaderRow}>
            <div className={styles.formIconContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z"/>
              </svg>
            </div>
            <div>{isActiveImage ? "Refernce photo" : "Add photo"}</div>
          </div>
          <div className={styles.fieldWidgetRow}>
            <label htmlFor="form-image-input">
              <div className={styles.addImageBox}>
                {isActiveImage ? (
                    <img src={postData.image.url} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                    </svg>
                )}
              </div>
            </label>
            <input
              id="form-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </div>  
        </div>
        {/* Select Date */}
        <div className={styles.formRow}>
          <div className={styles.fieldHeaderRow}>
            <div className={styles.formIconContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/>
              </svg>
            </div>
            <button
              onClick={handleDateClick}
              type="button"
            >
              {activeDate.format('MMM D, YYYY ')}
              <span className={styles.dayOfWeek}>
                {activeDate.format('(ddd)')}
              </span>
            </button>
          </div>
          <div className={styles.fieldWidgetRow}>
            {isCalendarExpanded ? (
              <div className={styles.calendarContainer}>
                <Calendar
                  activeDate={activeDate}
                  setActiveDate={setActiveDate}
                />
              </div>
            ) : ''}
          </div>
        </div>
        {/* Add Location */}
        <div className={styles.formRow}>
          <div className={styles.fieldHeaderRow}>
            <div className={styles.formIconContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M536.5-503.5Q560-527 560-560t-23.5-56.5Q513-640 480-640t-56.5 23.5Q400-593 400-560t23.5 56.5Q447-480 480-480t56.5-23.5ZM480-186q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/>
              </svg>
            </div>
            <input
              type='url'
              placeholder='Add location (ex. https://maps.google...)'
              onChange={handleLocationChange}
            />
          </div>
        </div>
        {/* Add notes */}
        <div className={styles.formRow}>
          <div className={styles.fieldHeaderRow}>
            <div className={styles.formIconContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M120-240v-80h480v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
              </svg>
            </div>
            <textarea
              className={styles.formTextArea}
              placeholder='Add notes'
              ref={notesRef}
              value={postData.notes}
              rows={1}
              onChange={handleNotesChange}
            >
            </textarea>
          </div>
        </div>
      </form>
      <div className={styles.formFiller}></div>
    </div>
  )
}

export default PostForm;