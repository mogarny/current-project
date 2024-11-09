import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getEvents } from "../service";
import {MyEvent} from "../model.ts";

interface EventsState {
    events: MyEvent[];
}

const initialState: EventsState = {
    events: getEvents() as MyEvent[],
};

const eventsSlice = createSlice({
    name: "events",
    initialState,
    reducers: {
        addEvent: (state, action: PayloadAction<MyEvent>) => {
            state.events.push(action.payload);
        },
        updateEvent: (state, action: PayloadAction<MyEvent>) => {
            const index = state.events.findIndex(
                (event) => event.id === action.payload.id
            );
            if (index !== -1) {
                state.events[index] = action.payload;
            }
        },
        deleteEvent: (state, action: PayloadAction<string>) => {
            state.events = state.events.filter(
                (event) => event.id !== action.payload
            );
        },
    },
});

export const { addEvent, updateEvent, deleteEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
