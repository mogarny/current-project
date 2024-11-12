import { Event } from "react-big-calendar";

export interface MyEvent extends Event {
    people?: string | null;
    id: string | undefined;
    image?: string;
}

export interface EventForm {
    start: string;
    end: string;
    title: string;
    people?: string | null;
}
