import { useLayoutEffect, useRef, useState, useEffect } from "react";
import styles from './ThreeDayContentGrid.module.css';
import DayColumn from '../DayColumn/DayColumn';
import StoryFieldLabelCol from '../StoryFieldLabelCol/StoryFieldLabelCol';

async function getDataForDay(curDate) {
  const dayIndex = Math.floor(curDate.valueOf() / 86400000);
  const dateStr = curDate.format('YYYY-MM-DD');
  const postList = await fetch(`/api/posts?date=${dateStr}`)
    .then(res => res.json());
  if (postList.length === 1) {
    return postList[0];
  }
  return {
    'id': null,
    'image_path': '',
    'post_date': dateStr,
    'location': '',
    'notes': '',
  }
}

async function createEntityData(initialDate){
  const entityData = [];
  for (let i = 0; i < 9; i++) {
    const curDate = initialDate.add(i-3, 'day');
    const curObj = await getDataForDay(curDate);
    entityData.push(curObj);
  }
  return entityData;
}

function ThreeDayContentGrid({
    activeDate,
    setActiveDate,
    isCalendarExpanded,
    setIsEditPostExpanded,
    setEditPostDate,
    reloadToken,
  }) {
  const [entityData, setEntityData] = useState([]);
  const [pendingDate, setPendingDate] = useState(null);
  useEffect(() => {
    async function loadEntityData() {
      const data = await createEntityData(activeDate);
      setEntityData(data)
    }
    loadEntityData();
  }, [activeDate, reloadToken]);
  const topRowHeight = '50px';
  const addNewRowHeight = '200px';
  const fieldRows = [
    { key: "image_path", label: "img", height: '200px'},
    { key: "id", label: "id", height: '30px'},
    { key: "notes", label: "notes", height: '120px'},
    { key: "location", label: "filler", height: '600px'},
  ]

  const yScrollableRefs = useRef([]);
  const isSyncingYRef = useRef(false);
  function updateYRefs(newScrollTop) { //  assumes you already clamped
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
    startScrollTop: 0,
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
      startScrollTop: yScrollableRefs.current[0].scrollTop,
    }
  }
  function handlePointerDown(e) {
    e.preventDefault();
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
    }
    else {
      dragStateRef.current.axis =  'y';
    }
  }
  function clamp(value,  min, max) {
    return Math.max(min, Math.min(value, max));
  }
  function handleXMove(e) {
    const dx = e.clientX - dragStateRef.current.startX;
    dayDataTrackRef.current.style.transform = `translateX(calc(-100% + ${dx}px))`;
  }
  function getTargetScrollTop(currentScrollTop, dy) {
    const el = yScrollableRefs.current[0]
    const maxScrollTop = el.scrollHeight - el.clientHeight;
    const unboundedScrollTop = currentScrollTop - dy;
    const targetScrollTop = clamp(unboundedScrollTop, 0, maxScrollTop);
    return targetScrollTop;
  }
  function handleYMove(e) {
    const dragState = dragStateRef.current;
    const dy = e.clientY - dragState.startY;
    const targetScrollTop =  getTargetScrollTop(dragState.startScrollTop, dy)
    updateYRefs(targetScrollTop);
  }
  function handleScrollWheel(e) {
    const dy = -e.deltaY;
    const currentScrollTop = yScrollableRefs.current[0].scrollTop;
    const targetScrollTop = getTargetScrollTop(currentScrollTop, dy);
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
    if (!dragStateRef.current.isDragging) return;
    const dragState = dragStateRef.current;
    if (dragState.axis === 'x' && xEnabled) {
      handleXDragPointerUp(e);
    } else if (dragState.axis === 'y' && yEnabled) {
      // do nothing
    }
    dragState.isDragging = false;
    dragState.axis = null;
  }
  function handleTransitionEnd(e) {
    if (e.propertyName !== 'transform') return;
    const snapTarget = snapTargetRef.current;
    if (!snapTarget.isSame(activeDate, 'day')) {
      setPendingDate(snapTarget);
    }
  }
  useEffect(() => {
    if (!pendingDate) return;
    let cancelled = false;
    async function loadEntityData() {
      const data = await createEntityData(pendingDate);
      if (cancelled) return;
      setEntityData(data)
      setActiveDate(pendingDate);
      requestAnimationFrame(() => {
        if (!dayDataTrackRef.current) return;
        dayDataTrackRef.current.style.transition = 'none';
        dayDataTrackRef.current.style.transform = 'translateX(-100%)';
      });
      setPendingDate(null);
    }
    loadEntityData();
    return () => {
      cancelled = true;
    };
  }, [pendingDate, setActiveDate]);
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
        handleScrollWheel={handleScrollWheel}
      />
      <div
        ref={dayDataViewportRef}
        className={styles.dayDataViewport}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMoveDayDates}
        onPointerUp={handlePointerUpDayDates}
        onWheel={handleScrollWheel}
      >
        <div
          ref={dayDataTrackRef}
          className={styles.dayDataTrack}
          onTransitionEnd={handleTransitionEnd}
        >
          {entityData.map((dayData, i) => (
            <DayColumn
              key={dayData.post_date}
              topRowHeight={topRowHeight}
              addNewRowHeight={addNewRowHeight}
              isCalendarExpanded={isCalendarExpanded}
              fieldRows={fieldRows}
              dayData={dayData}
              fieldDataViewportRef={(el) => {
                yScrollableRefs.current[i + 1] = el;
              }}
              setIsEditPostExpanded={setIsEditPostExpanded}
              setEditPostDate={setEditPostDate}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThreeDayContentGrid;