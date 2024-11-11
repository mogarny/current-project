import {getEvents, deleteEvent, setEvent as persistEventsToLocalStorage} from "../service";
import { MyEvent } from "../model.ts";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EventsState {
    events: MyEvent[];
}

export const saveEvents = event => async dispatch => {
    persistEventsToLocalStorage(event);
     dispatch(setEventFn(event));
}

export const removeEvent = event => async dispatch => {
    deleteEvent(event);
    dispatch(deleteEventFn(event));
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
                start: new Date(action.payload.start),
                end: new Date(action.payload.end),
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
            state.events = state.events.filter(
                (event) => event.id !== action.payload
            );
        },
    },
});

export const {  updateEvent, deleteEventFn, setEventFn } = eventsSlice.actions;
export default eventsSlice.reducer;
