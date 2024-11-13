import {getEvents, deleteEvent, setEvent as persistEventsToLocalStorage, updateEvent} from "../service";
import {MyEvent, SerializedEvent} from "../model.ts";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EventsState {
    events: MyEvent[];
}

export const saveEvents = (event: MyEvent) => async (dispatch: (arg0: { payload: SerializedEvent; type: "events/setEventFn"; }) => void) => {
    const serializedEvent: SerializedEvent = {
        ...event,
        start: new Date(event.start!).toISOString(),
        end: new Date(event.end!).toISOString(),
    }
    persistEventsToLocalStorage(serializedEvent);
     dispatch(setEventFn(serializedEvent));
}

export const updateEventMid = (newEvent: MyEvent) => async (dispatch: (arg0: PayloadAction<SerializedEvent, "events/updateEventFn">) => MyEvent) => {
    const serializedEvent: SerializedEvent = {
        ...newEvent,
        start: new Date(newEvent.start!).toISOString(),
        end: new Date(newEvent.end!).toISOString(),
    }
    updateEvent(serializedEvent);
    dispatch(updateEventFn(serializedEvent))
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
        setEventFn: (state, action: PayloadAction<SerializedEvent>) => {
            state.events = [...state.events, {
                ...action.payload,
                start: new Date(action.payload.start!),
                end: new Date(action.payload.end!),
            }];
        },
        updateEventFn: (state, action: PayloadAction<SerializedEvent>) => {
            const index = state.events.findIndex(
                (event) => event.id === action.payload.id
            );
            if (index !== -1) {
                state.events[index] = {
                    ...action.payload,
                    start: new Date(action.payload.start!),
                    end: new Date(action.payload.end!),
                };
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

export const {  updateEventFn, deleteEventFn, setEventFn } = eventsSlice.actions;
export default eventsSlice.reducer;
