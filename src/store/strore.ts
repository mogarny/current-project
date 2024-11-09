import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./eventSlice.ts";

export const store = configureStore({
    reducer: {
        events: eventsReducer,
    },
});
