import {getEvents, deleteEvent, setEvent as persistEventsToLocalStorage} from "../service";
import { MyEvent } from "../model.ts";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EventsState {
    events: MyEvent[];
}

export const saveEvents = (event: MyEvent) => async (dispatch: (arg0: { payload: MyEvent; type: "events/setEventFn"; }) => void) => {
    const serializedEvent = {
        ...event,
        start: new Date(event.start!).toISOString(),
        end: new Date(event.end!).toISOString(),
    }
    persistEventsToLocalStorage(serializedEvent);
     dispatch(setEventFn(serializedEvent));
}

export const removeEvent = (id: string) => async (dispatch: (arg0: { payload: string; type: "events/deleteEventFn"; }) => void) => {
    deleteEvent(id);
    dispatch(deleteEventFn(id));
}

const initialState: EventsState = {
    events: getEvents(),
};

const eventsSlice = createSlice({
    name: "events",
    initialState,
    reducers: {
        setEventFn: (state, action: PayloadAction<MyEvent>) => {
            state.events = [...state.events, {
                ...action.payload,
                start: new Date(action.payload.start!).toISOString(),
                end: new Date(action.payload.end!).toISOString(),
            }];
        },
        updateEvent: (state, action: PayloadAction<MyEvent>) => {
            const index = state.events.findIndex(
                (event) => event.id === action.payload.id
            );
            if (index !== -1) {
                state.events[index] = action.payload;
            }
        },
        deleteEventFn: (state, action: PayloadAction<string>) => {
            console.log('delete')
            state.events = state.events.filter(
                (event) => event.id !== action.payload
            );
        },
    },
});

export const {  updateEvent, deleteEventFn, setEventFn } = eventsSlice.actions;
export default eventsSlice.reducer;
