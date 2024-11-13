import {MyEvent, SerializedEvent} from "./model";

function replacer(key: string, value: any) {
    // @ts-ignore
    console.log("here", this);
    // @ts-ignore
    if (this[key] instanceof Date) {
        // @ts-ignore
        return this[key].toISOString();
    }
    return value;
}

export function getEvents(): MyEvent[] {
    return JSON.parse(localStorage.getItem("events") ?? "[]").map((event: MyEvent) => ({
        ...event,
        start: new Date(event.start!),
        end: new Date(event.end!),
    }));
}

export function getEvent(id: string): MyEvent {
    return JSON.parse(localStorage.getItem("events") ?? "[]").find(
        (event: MyEvent) => event.id === id
    );
}

export function setEvent(newEvent: SerializedEvent) {
    let events = JSON.parse(localStorage.getItem("events") || "[]");
    if (!Array.isArray(events)) {
        events = [];
    }
    events.push({
        ...newEvent,
        start: new Date(newEvent.start!).toISOString(),
        end: new Date(newEvent.end!).toISOString(),
    });
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
    let events: MyEvent[] = getEvents().map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
    );
    localStorage.setItem("events", JSON.stringify(events, replacer));
}
