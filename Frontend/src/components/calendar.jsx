import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";

function LeaveCalendar({ submitedFormData }) {

  const [selectedDate, setSelectedDate] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const closePopover = () => {
    setIsClosing(true);
    window.setTimeout(() => setSelectedDate(null), 180);
  };

  const getPopoverPosition = (element) => {
    const bounds = element.getBoundingClientRect();
    const popoverWidth = 260;
    const gap = 10;
    const top = bounds.bottom + gap;
    const shouldOpenAbove = top + 260 > window.innerHeight && bounds.top > 270;

    return {
      top: shouldOpenAbove ? bounds.top - gap : top,
      left: Math.min(
        Math.max(12, bounds.left + (bounds.width - popoverWidth) / 2),
        window.innerWidth - popoverWidth - 12
      ),
      placement: shouldOpenAbove ? "above" : "below",
    };
  };

  const handleDateClick = (info) => {
    const dateObj = info.date;

    const dateData = {
      monthName: dateObj.toLocaleString("en-US", { month: "long" }),
      dayName: dateObj.toLocaleString("en-US", { weekday: "long" }),
      dayNumber: dateObj.getDate(),
      dateStr: info.dateStr,
      events: getEventsForDate(info.dateStr),
      ...getPopoverPosition(info.dayEl),
    };

    setIsClosing(false);
    setSelectedDate(dateData);
  };

  const handleEventClick = (info) => {
    const event = info.event;
    console.log(event)
    const dayElement = info.el.closest(".fc-daygrid-day");
    const ends = event.endStr
    let newStrEnd = null
    if(ends){
      const end = new Date(ends)
      const newEnd = end.setDate(end.getDate() - 1)
      newStrEnd = new Date(newEnd).toISOString().split('T')[0];
    }

    setIsClosing(false);
    setSelectedDate({
      dayName: event.start?.toLocaleString("en-US", { weekday: "long" }) || "Leave details",
      monthName: event.start?.toLocaleString("en-US", { month: "long" }) || "",
      dayNumber: event.start?.getDate() || "",
      dateStr: event.startStr,
      ...getPopoverPosition(dayElement || info.el),
      eventDetails: {
        leaveType: event.title,
        startDate: event.extendedProps.start || event.startStr,
        endDate: newStrEnd || ends || "Not provided",
        reason: event.extendedProps.reason || "No reason provided",
        document: event.extendedProps.document,
      },
    });
  };

  const getEventsForDate = (dateStr) => (submitedFormData || []).filter((event) => {
    const start = event.start?.slice(0, 10);
    const end = (event.endReal || event.end || event.start)?.slice(0, 10);

    if (!start || !end) return false;
    if (start === end) return dateStr === start;

    return dateStr >= start && dateStr < end;
  });

  useEffect(() => {
    if (!selectedDate) return undefined;

    const handleOutsideClick = (event) => {
      if (
        event.target.closest(".date-popover") ||
        event.target.closest(".fc-daygrid-day")
      ) return;

      closePopover();
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setSelectedDate(null);
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedDate]);


  return (
    <div className="leave-calendar">

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={submitedFormData}

        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "today"
        }}

        dateClick={handleDateClick}
        eventClick={handleEventClick}
        
      />
      {selectedDate && (
        <div
          className={`date-popover date-popover-${selectedDate.placement}${isClosing ? " date-popover-closing" : ""}`}
          style={{ top: selectedDate.top, left: selectedDate.left }}
          role="dialog"
          aria-label={`Leaves on ${selectedDate.dateStr}`}
        >
          <div className="date-popover-header">
            <div>
              <strong>{selectedDate.dayName}</strong>
              <span>{selectedDate.monthName} {selectedDate.dayNumber}</span>
            </div>
            <button type="button" onClick={closePopover} aria-label="Close">
              &times;
            </button>
          </div>

          {selectedDate.eventDetails ? (
            <div className="event-details">
              <div className="event-detail-row">
                <span>Leave type</span>
                <strong>{selectedDate.eventDetails.leaveType}</strong>
              </div>
              <div className="event-detail-row">
                <span>Start date</span>
                <strong>{selectedDate.eventDetails.startDate}</strong>
              </div>
              <div className="event-detail-row">
                <span>End date</span>
                <strong>{selectedDate.eventDetails.endDate}</strong>
              </div>
              <div className="event-detail-row event-detail-reason">
                <span>Reason</span>
                <strong>{selectedDate.eventDetails.reason}</strong>
              </div>
              {selectedDate.eventDetails.document && (
                <div className="event-detail-row">
                  <span>Document</span>
                  <strong>
                    {selectedDate.eventDetails.document.name || selectedDate.eventDetails.document}
                  </strong>
                </div>
              )}
            </div>
          ) : selectedDate.events.length ? (
            <div className="date-popover-events">
              {selectedDate.events.map((event, index) => (
                <div key={`${event.title}-${index}`} className={`event-card ${event.classNames?.join(" ") || ""}`}>
                  <strong>{event.title}</strong>
                  <span>{event.status || event.classNames?.[0]?.replace("-leave", "") || "Leave"}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-leave">No leave</p>
          )}
        </div>
      )}

      <div className="calendar-legend">
        <span>Approved</span>
        <span>Pending</span>
        <span>Holiday</span>
        <span>Rejected</span>
      </div>

    </div>
  );
}

export default LeaveCalendar;