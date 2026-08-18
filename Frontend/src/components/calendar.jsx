import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function LeaveCalendar({submitedFormData}) {

  const events = [
    {
      title: "Casual Leave",
      start: "2026-08-20",
      end: "2026-08-23",
      classNames: ["approved-leave"]
    },
    {
      title: "Casual Leave",
      start: "2026-08-03",
      end: "2026-08-04",
      classNames: ["rejected-leave"]
    },
    {
      title: "Sick Leave",
      start: "2026-08-28",
      end: "2026-08-30",
      classNames: ["pending-leave"]
    },
    {
      title: "Independence Day",
      start: "2026-08-15",
      classNames: ["company-holiday"]
    }
  ];

  // const handleDateClick = (info) => {
  //   console.log("Clicked:", info.dateStr);
  // };

  // const handleEventClick = (info) => {
  //   console.log("Clicked event:", info.event);
  // };

  return (
    <div className="leave-calendar">

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={submitedFormData}

        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "today"
        }}

        // dateClick={handleDateClick}
        // eventClick={handleEventClick}
      />

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