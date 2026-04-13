import { useState, useRef } from "react";
import styles from './Myapp.module.css';
import dayjs from 'dayjs';
import Calendar from './Calendar/Calendar';
import ThreeDayContentGrid from './ThreeDayContentGrid/ThreeDayContentGrid';
import PostForm from './PostForm/PostForm';

const today = dayjs();
function Myapp() {
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [activeDate, setActiveDate] = useState(today);
  const [isEditPostExpanded, setIsEditPostExpanded] = useState(false);
  const [overlayHeight, setOverlayHeight] = useState(window.innerHeight);
  const toggleCalendar = () => {
    setIsCalendarExpanded(prev => !prev);
  }
  const dragStateRef = useRef({
      isDragging: false,
      startY: 0,
      startHeight: 0,
    })
  function handleOverlayPointerDown(e) {
    dragStateRef.current.isDragging = true;
    dragStateRef.current.startY = e.clientY;
    dragStateRef.current.startHeight = overlayHeight;

    window.addEventListener('pointermove', handleOverlayPointerMove);
    window.addEventListener('pointerup', handleOverlayPointerUp);
  }
  function handleOverlayPointerMove(e) {
    if (!dragStateRef.current.isDragging) return;
    const { startY, startHeight } = dragStateRef.current;
    const dy = startY - e.clientY;
    const unclampedHeight = startHeight + dy;
    const clampedHeight = Math.min(unclampedHeight, window.innerHeight);
    setOverlayHeight(clampedHeight);
  }
  function handleOverlayPointerUp() {
    dragStateRef.current.isDragging = false;
    window.removeEventListener('pointermove', handleOverlayPointerMove);
    window.removeEventListener('pointerup', handleOverlayPointerUp);
  }
  return (
    <div className={styles.appShell}>
      <div className={styles.header}>
        <div className={styles.appHeader}>
          <div className={styles.appHeaderLeft}>
            <div className={styles.hamburger}>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className={styles.monthArrow} onClick={toggleCalendar}>
              <div>{activeDate.format("MMMM")}</div>
              <svg
                className={`${styles.arrow} ${isCalendarExpanded ? styles.arrowExpanded : ""}`}
                viewBox="0 0 10 10" width="10" height="10">
                <polygon points="0,0 10,5 0,10" fill="black" />
              </svg>
            </div>
          </div>
          <div className={styles.appHeaderRight}>
            <img src='pfp-64-64.png' className={styles.pfp} />
          </div>
        </div>
        {isCalendarExpanded && (
          <Calendar
            activeDate={activeDate}
            setActiveDate={setActiveDate}
          />
        )}
      </div>

      <ThreeDayContentGrid
        activeDate={activeDate}
        setActiveDate={setActiveDate}
        isCalendarExpanded={isCalendarExpanded} // conditionally change background color of header
        setIsEditPostExpanded={setIsEditPostExpanded}
      />

      {isEditPostExpanded && (
        <div
          className={styles.postFormOverlay}
          style={{ height: `${overlayHeight}px`}}
        >
          <PostForm
            handleOverlayPointerDown={handleOverlayPointerDown}
            setIsEditPostExpanded={setIsEditPostExpanded}
          />
        </div>
      )}
    </div>
  )
}

export default Myapp