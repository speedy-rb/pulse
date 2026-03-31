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
  const addNewRowHeight = '200px';
  const fieldRows = [
    { key: "img", label: "img", height: '200px'},
    // { key: "date", label: "date", height: '50px'},
    { key: "id", label: "id", height: '30px'},
    { key: "notes", label: "notes", height: '120px'},
    { key: "filler", label: "filler", height: '400px'},
  ]

  const yScrollableRefs = useRef([]);
  const isSyncingYRef = useRef(false);
  function syncYScroll(el) {
    const scrollTop = el.scrollTop;
    updateYRefs(scrollTop);
  }
  function updateYRefs(newScrollTop) {
    if (isSyncingYRef.current) return;
    isSyncingYRef.current = true;
    yScrollableRefs.current.forEach((el, i) => {
      el.scrollTop = newScrollTop;
    });
    requestAnimationFrame(() => {
      isSyncingYRef.current = false;
    });
  }

  const dayDataViewportRef = useRef(null);
  const dayDataTrackRef = useRef(null);
  const dragStateRef = useRef({
    isDragging: false,
    axis: null, // 'x' | 'y' | null
    startX: 0,
    startY: 0,
    startTime: null,
    currentScrollTop: 0,
  })
  const snapTargetRef = useRef(activeDate); // index of activeDate

  useLayoutEffect(() => { // prevent flicker on horizontal swipe
    if (!dayDataTrackRef.current) return;
    dayDataTrackRef.current.style.transition = 'none';
    dayDataTrackRef.current.style.transform = 'translateX(-100%)';
  }, [activeDate]);

  function updateDragStateRefForEvent(e) {
    dragStateRef.current = {
      isDragging: true,
      axis: null,
      startX: e.clientX,
      startY: e.clientY,
      startTime: performance.now(),
      currentScrollTop: yScrollableRefs.current[0].scrollTop,
    }
  }
  function handlePointerDown(e) {
    console.log('handlePointerDown');
    e.currentTarget.setPointerCapture(e.pointerId);
    updateDragStateRefForEvent(e);
    dayDataTrackRef.current.style.transition = 'none';
    return
  }
  function determineSwipeAxis(dx, dy) {
    const threshold = 8;
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      dragStateRef.current.axis =  'x';
      console.log('x scroll');
    }
    else {
      dragStateRef.current.axis =  'y';
      console.log('y scroll');
    }
  }
  function clamp(value,  min, max) {
    return Math.max(min, Math.min(value, max));
  }
  function handleXMove(e) {
    const dx = e.clientX - dragStateRef.current.startX;
    dayDataTrackRef.current.style.transform = `translateX(calc(-100% + ${dx}px))`;
  }
  function handleYMove(e) {
    const dragState = dragStateRef.current;
    const dy = e.clientY - dragState.startY;
    console.log('y stuff');
    const maxScrollTop = yScrollableRefs.current[0].scrollHeight - yScrollableRefs.current[0].clientHeight;
    const unboundedScrollTop = dragState.currentScrollTop - dy
    const targetScrollTop = clamp(unboundedScrollTop, 0, maxScrollTop);
    console.log(`${maxScrollTop} ${unboundedScrollTop} ${targetScrollTop}`)
    updateYRefs(targetScrollTop);
  }

  function handlePointerMove(e, xEnabled, yEnabled) {
    if (!dragStateRef.current.isDragging) return;
    e.preventDefault();
    const dragState = dragStateRef.current;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    if (!dragState.axis) { // set the axis of scrolling
      determineSwipeAxis(dx, dy);
    }
    if (dragState.axis === 'x' && xEnabled) {
      handleXMove(e);
    } else if (dragState.axis === 'y' && yEnabled) {
      handleYMove(e);
    }
  }
  function handlePointerMoveDayDates(e) {
    handlePointerMove(e, true, true);
  }
  function handlePointerMoveFieldCol(e) {
    handlePointerMove(e, false, true);
  }
  function handleXDragPointerUp(e) {
    const dragState = dragStateRef.current;
    const VELOCITY_THRESHOLD = 0.35
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
  }
  function handlePointerUpDayDates(e) {
    handlePointerUp(e, true, true);
  }
  function handlePointerUpFieldCol(e) {
    handlePointerUp(e, false, true);
  }
  function handlePointerUp(e, xEnabled, yEnabled) {
    console.log('handlePointerUp');
    if (!dragStateRef.current.isDragging) return;
    const dragState = dragStateRef.current;
    if (dragState.axis === 'x' && xEnabled) {
      console.log('x pointer up stuff');
      handleXDragPointerUp(e);
    } else if (dragState.axis === 'y' && yEnabled) {
      console.log('y pointer up stuff');
      // do nothing
    }
    dragState.isDragging = false;
    dragState.axis = null;
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
        fieldLabelsViewportRef={(el) => {
          yScrollableRefs.current[0] = el;
        }}
        handlePointerDown={handlePointerDown}
        handlePointerMove={handlePointerMoveFieldCol}
        handlePointerUp={handlePointerUpFieldCol}
      />
      <div
        ref={dayDataViewportRef}
        className={styles.dayDataViewport}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMoveDayDates}
        onPointerUp={handlePointerUpDayDates}
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
              fieldDataViewportRef={(el) => {
                yScrollableRefs.current[i + 1] = el;
              }}
              onFieldDataScroll={(e) => syncYScroll(e.currentTarget)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThreeDayContentGrid;