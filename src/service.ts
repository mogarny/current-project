import moment from "moment";
import { MyEvent } from "./model";

function replacer(key: string, value: any) {
    console.log("here", this);
    if (this[key] instanceof Date) {
        return moment(this[key]).format("YYYY-MM-DDTHH:mm");
    }
    return value;
}

export function getEvents(): MyEvent[] {
    return JSON.parse(localStorage.getItem("events") ?? "[]");
}

export function getEvent(id: string): MyEvent {
    return JSON.parse(localStorage.getItem("events") ?? "[]").find(
        (event: MyEvent) => event.id === id
    );
}

export function setEvent(newEvent: MyEvent) {
    let events = JSON.parse(localStorage.getItem("events") || "[]");
    if (!Array.isArray(events)) {
        events = [];
    }
    events.push(newEvent);
    localStorage.setItem("events", JSON.stringify(events, replacer));
}

export function deleteEvent(id: string | undefined): void {
    localStorage.setItem(
        "events",
        JSON.stringify(
            getEvents().filter((event: MyEvent) => event.id !== id),
            replacer
        )
    );
}

export function updateEvent(updatedEvent: MyEvent) {
    let events: MyEvent[] = JSON.parse(localStorage.getItem("events") || "[]");

    events = events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
    );
    localStorage.setItem("events", JSON.stringify(events, replacer));
}
