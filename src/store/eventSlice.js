import { createSlice } from "@reduxjs/toolkit";
import { getEvents } from "./";

const initialState = {
    events: getEvents,
};

const eventsSlice = createSlice({
    name: "events",
    initialState,
    reducers: {
        addEvent: (state, action) => {
            state.events.push(action.payload);
        },
        updateEvent: (state, action) => {
            const index = state.events.findIndex(
                (event) => event.id === action.payload.id
            );
            if (index !== -1) {
                state.events[index] = action.payload;
            }
        },
        deleteEvent: (state, action) => {
            state.events = state.events.filter(
                (event) => event.id !== action.payload
            );
        },
    },
});

export const { addEvent, updateEvent, deleteEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
