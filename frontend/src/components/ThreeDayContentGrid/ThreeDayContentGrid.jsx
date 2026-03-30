import { useLayoutEffect, useRef, useState } from "react";
import styles from './ThreeDayContentGrid.module.css';
import DayColumn from '../DayColumn/DayColumn';
import StoryFieldLabelCol from '../StoryFieldLabelCol/StoryFieldLabelCol';

function getDataForDay(dateObj) {
  const dayIndex = Math.floor(dateObj.valueOf() / 86400000);
  const mod = dayIndex % 3;
  const id = dateObj.startOf('day').valueOf();
  return {
    'id': dayIndex,
    'img': `ref_story_${mod}.jpg`,
    'notes': `post ${dayIndex} details`,
    'date': dateObj.format("MM-DD-YYYY"),
    'filler': '...',
    'dateObj': dateObj
  }
}

function createEntityData(initialDate){
  const entityData = [];
  for (let i = 0; i < 9; i++) {
    const curDate = initialDate.add(i-3, 'day');
    const curObj = getDataForDay(curDate);
    entityData.push(curObj);
  }
  return entityData
}

function ThreeDayContentGrid({ activeDate, setActiveDate, isCalendarExpanded }) {
  const entityData = createEntityData(activeDate);
  const topRowHeight = '50px';
  const addNewRowHeight = '100px';
  const fieldRows = [
    { key: "img", label: "img", height: '200px'},
    // { key: "date", label: "date", height: '50px'},
    { key: "id", label: "id", height: '30px'},
    { key: "notes", label: "notes", height: '120px'},
    { key: "filler", label: "filler", height: '400px'},
  ]

  const dayDataViewportRef = useRef(null);
  const dayDataTrackRef = useRef(null);
  const dragStateRef = useRef({
    isDragging: false,
    axis: null, // 'x' | 'y' | null
    startX: 0,
    startY: 0,
    startTime: null,
  })
  const snapTargetRef = useRef(activeDate); // index of activeDate

  useLayoutEffect(() => {
    if (!dayDataTrackRef.current) return;
    dayDataTrackRef.current.style.transition = 'none';
    dayDataTrackRef.current.style.transform = 'translateX(-100%)';
  }, [activeDate]);

  function handlePointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current.isDragging = true;
    dragStateRef.current.axis = null;
    dragStateRef.current.startX = e.clientX;
    dragStateRef.current.startY = e.clientY;
    dragStateRef.current.startTime = performance.now();
    dayDataTrackRef.current.style.transition = 'none';
    return
  }
  function handlePointerMove(e) {
    const dragState = dragStateRef.current;
    if (!dragState.isDragging) return;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    if (!dragState.axis) {
      const threshold = 8;
      if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;
      dragState.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if (dragState.axis === 'x') {
      e.preventDefault();
      dayDataTrackRef.current.style.transform = `translateX(calc(-100% + ${dx}px))`;
    }
  }
  function handlePointerUp(e) {
    const VELOCITY_THRESHOLD = 0.35
    const dragState = dragStateRef.current;
    if (!dragState.isDragging) return;
    dragStateRef.current.isDragging = false;
    const dx = e.clientX - dragState.startX;
    const time = performance.now() - dragState.startTime;
    const velocity = dx / time;
    const viewportWidth = dayDataViewportRef.current.clientWidth;
    const columnWidth = viewportWidth / 3;
    let shift;
    if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
      shift = dx > 0 ? 3 : -3;
    } else {
      shift = Math.round(dx / columnWidth);
    }
    dayDataTrackRef.current.style.transition = 'transform 200ms ease';
    dayDataTrackRef.current.style.transform = `translateX(calc(-100% + ${shift * columnWidth}px))`;
    snapTargetRef.current = activeDate.add(-shift, 'days');
    dragStateRef.current.axis = null;
  }
  function handleTransitionEnd(e) {
    if (e.propertyName !== 'transform') return;
    const snapTarget = snapTargetRef.current;
    if (!snapTarget.isSame(activeDate, 'day')) {
      setActiveDate(snapTarget);
    }
  }

  return (
    <div className={styles.threeDayContentGrid}>
      <StoryFieldLabelCol
        topRowHeight={topRowHeight}
        addNewRowHeight={addNewRowHeight}
        fieldRows={fieldRows}
        isCalendarExpanded={isCalendarExpanded}
      />
      <div
        ref={dayDataViewportRef}
        className={styles.dayDataViewport}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          ref={dayDataTrackRef}
          className={styles.dayDataTrack}
          onTransitionEnd={handleTransitionEnd}
        >
          {entityData.map((dayData, i) => (
            <DayColumn
              key={i}
              topRowHeight={topRowHeight}
              addNewRowHeight={addNewRowHeight}
              isCalendarExpanded={isCalendarExpanded}
              fieldRows={fieldRows}
              dayData={dayData}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThreeDayContentGrid;