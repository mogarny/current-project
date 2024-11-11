import { Calendar, momentLocalizer, ToolbarProps } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {updateEvent } from "./service";
import { Link, useNavigate } from "react-router-dom";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { MyEvent } from "./model";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "./store/strore.ts";
import {eventsWithDates} from "./store/eventSlice.ts";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

export const MyCalendar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const events = useSelector((state: RootState) => state.events.events);

    const handleClick = (arg: any) => {
        console.log("Event clicked: ", arg);
        const eventId = arg.id;
        goToEvent(eventId);
    };

    const goToEvent = (eventId: string) => {
        navigate(`/event/${eventId}`);
    };

    const onEventDrop = ({ event, start, end }: any) => {
        event.start = start;
        event.end = end;
        console.log(event);

        updateEvent(event);
    };

    return (
        <div>
            <DragAndDropCalendar
                localizer={localizer}
                events={events}
                startAccessor={(event: Object) =>
                    new Date((event as MyEvent).start!)
                }
                endAccessor={(event: Object) =>
                    new Date((event as MyEvent).end!)
                }
                onEventDrop={onEventDrop}
                onSelectEvent={(event) => {
                    handleClick(event);
                }}
                components={{
                    toolbar: CustomToolbar,
                }}
                formats={{
                    timeGutterFormat: "HH:mm",
                    eventTimeRangeFormat: (
                        { start, end },
                        culture,
                        localizer
                    ) =>
                        `${localizer!.format(
                            start,
                            "HH:mm",
                            culture
                        )} - ${localizer!.format(end, "HH:mm", culture)}`,
                    dayHeaderFormat: "ddd, MMM D",
                    dayRangeHeaderFormat: (
                        { start, end },
                        culture,
                        localizer
                    ) =>
                        `${localizer!.format(
                            start,
                            "MMM D",
                            culture
                        )} - ${localizer!.format(end, "MMM D", culture)}`,
                }}
            />
        </div>
    );
};

const CustomToolbar = ({ onNavigate, onView, label }: ToolbarProps) => {
    return (
        <div className="rbc-toolbar">
            <span className="rbc-btn-group">
                <button onClick={() => onNavigate("PREV")}>Back</button>
                <button onClick={() => onNavigate("TODAY")}>Today</button>
                <button onClick={() => onNavigate("NEXT")}>Next</button>
            </span>

            <span className="rbc-toolbar-label">{label}</span>

            <span className="rbc-btn-group">
                <button onClick={() => onView("month")}>Month</button>
                <button onClick={() => onView("week")}>Week</button>
                <button onClick={() => onView("day")}>Day</button>
            </span>

            <span className="rbc-btn-group">
                <Link to="/add-event">
                    <button>Add Event</button>
                </Link>
            </span>
        </div>
    );
};
