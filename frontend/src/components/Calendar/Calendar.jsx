import { useLayoutEffect, useRef, useState } from "react";
import styles from './Calendar.module.css';
import MonthGrid from '../MonthGrid/MonthGrid';

function getWeekCount(monthObj) {
  const firstDayOfWeek = monthObj.startOf("month").day();
  const daysInMonth = monthObj.daysInMonth();
  return Math.ceil((firstDayOfWeek + daysInMonth) / 7);
}

function getCalendarHeight(dayObj) {
  const weekCount = getWeekCount(dayObj);
  const globalStyles = getComputedStyle(document.documentElement);
  const topMarginHeight = parseFloat(globalStyles.getPropertyValue('--calendar-header-top-margin'));
  const labelRowHeight = parseFloat(globalStyles.getPropertyValue('--calendar-header-height'));
  const gapHeight = parseFloat(globalStyles.getPropertyValue('--calendar-gap-header-body'));
  const rowHeight = parseFloat(globalStyles.getPropertyValue('--calendar-row-height'));
  const calendarHeight = topMarginHeight + labelRowHeight + gapHeight + rowHeight * weekCount;
  return calendarHeight
}

function Calendar({ activeDate, setActiveDate }) {
  const currentMonth = activeDate.startOf("month");
  const prevMonth = currentMonth.subtract(1, "month");
  const nextMonth = currentMonth.add(1, "month");

  const calendarHeight = getCalendarHeight(currentMonth);

  const viewportRef = useRef(null); // used to determine screen width for switching months
  const trackRef = useRef(null);

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const snapTargetRef = useRef('current');

  useLayoutEffect(() => { // avoid flickering dates
    if (!trackRef.current) return;
    trackRef.current.style.transition = 'none';
    trackRef.current.style.transform = 'translateX(-100%)';
  }, [activeDate]);

  function handlePointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    trackRef.current.style.transition = 'none';
  }
  function handlePointerMove(e) {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    trackRef.current.style.transform = `translateX(calc(-100% + ${deltaX}px))`;
  }
  function handlePointerUp(e) {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const deltaX = e.clientX - dragStartXRef.current;
    const viewPortWidth = viewportRef.current.offsetWidth;
    const threshold = viewPortWidth / 2;

    trackRef.current.style.transition = 'transform 200ms ease';

    if (deltaX > threshold) {
      snapTargetRef.current = 'prev';
      trackRef.current.style.transform = 'translateX(0%)';
    } else if (deltaX < -threshold) {
      snapTargetRef.current = 'next';
      trackRef.current.style.transform = 'translateX(-200%)';
    } else {
      snapTargetRef.current = 'current';
      trackRef.current.style.transform = 'translateX(-100%)';
    }
  }
  function handleTransitionEnd(e) { // avoid flickering dates
    if (e.propertyName !== 'transform') return;
    const snapTarget = snapTargetRef.current;
    snapTargetRef.current = 'current';

    if (snapTarget === 'prev') {
      setActiveDate(prevMonth);
    } else if (snapTarget === 'next') {
      setActiveDate(nextMonth);
    }
  }

  return <>
    <div
      ref={viewportRef}
      className={styles.calendarViewport}
      style = {{ height: `${calendarHeight}px`}}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        ref={trackRef}
        className={styles.calendarTrack}
        onTransitionEnd={handleTransitionEnd}
      >
        <MonthGrid
          monthObj={prevMonth}
          setActiveDate={setActiveDate}
        />
        <MonthGrid
          monthObj={currentMonth}
          highlightedDate={activeDate}
          setActiveDate={setActiveDate}
        />
        <MonthGrid
          monthObj={nextMonth}
          setActiveDate={setActiveDate}
        />
      </div>
    </div>
  </>
}

export default Calendar;