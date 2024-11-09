import { NavigateOptions, useNavigate, useParams } from "react-router-dom";
import { getEvent, deleteEvent } from "./service";
import { MyEvent } from "./model";
import moment from "moment";
import './event.scss'
import { toSvg } from 'jdenticon';


export const Event = () => {
    const params = useParams();    
    const event: MyEvent = getEvent(params.id!);
    let svg = toSvg(event.title, 122);
    const markup = { __html: svg };
    const navigate = useNavigate();
    console.log(svg)

    const dataToDisplay = (date: Date) => {
        console.log(date);
        
        return moment(date).format('HH:mm - DD MMMM yyyy');
    }

    const deleteEventM = (id: string) => {
        deleteEvent(id);
        navigate('/');
    }

    const editEvent = () => {
        navigate(`/add-event/${event.id}`);
    }

    return (
        <>
         <div className="event-card">
                <div className="event-container">
            <div className="event-svg" dangerouslySetInnerHTML={markup}></div>

             </div>

                <div className="event-details">
            <h2 className="event-title">{event.title!}</h2>
            <p className="event-timing">
                <strong>Start:</strong> {dataToDisplay(event.start!)}
                <br/>
                <strong>End:</strong>{dataToDisplay(event.end!)}
            </p>
            <p className="event-people">
                {event.people && 'Attendees:' + event.people}
            </p>

            <button className="edit-button" onClick={() => editEvent()}>Edit</button>
            <button className="edit-button" onClick={() => deleteEventM(event.id!)}>Delete</button>
            <br/>
            <a className="go-calendar" href="/">Go back to calendar</a>

             </div>
         </div>
        </>
    )
}