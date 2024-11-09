import "./add-event.scss";
import { useForm, useWatch } from "react-hook-form";
import * as Yup from "yup";
import { EventForm, MyEvent } from "./model";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from "uuid";
import { FormEvent, useEffect, useState } from "react";
import { getEvent, getEvents, setEvent, updateEvent } from "./service";
import { useLocation, useNavigate, useParams } from "react-router-dom";

let schema = Yup.object()
    .shape({
        title: Yup.string().required("Title is required").default(""),
        start: Yup.string().required("Start date is required").default(""),
        end: Yup.string().test(
            "is-after-start",
            "The end date must be after the start date",
            function (value) {
                const { start } = this.parent;
                if (!start || !value) return true;
                return new Date(value) > new Date(start);
            }
        ),
    })
    .default("");

export const AddEvent = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const event: MyEvent = getEvent(params.id!) || undefined;
    const {
        handleSubmit,
        register,
        control,
        setValue,
        formState: { errors },
        // @ts-ignore
    } = useForm<FormEvent>({
        resolver: yupResolver(schema),
        defaultValues: event,
    });

    const start = useWatch({ control, name: "start" });
    const end = useWatch({ control, name: "end" });

    useEffect(() => {
        if (start && !end) {
            console.log(start, end);
            setValue("end", addMinutes(start, 60));
        } else if (start && end && isEditMode) {
            console.log(start, end);
            setValue("end", addMinutes(start, 60));
        } else if (params.id) {
            setIsEditMode(true);
        }
    }, [start]);

    const addMinutes = (date: string, minutes: number) => {
        const newDate = new Date(new Date(date).getTime() + minutes * 60000);
        return `${newDate.getFullYear()}-${(newDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${newDate
            .getDate()
            .toString()
            .padStart(2, "0")}T${newDate
            .getHours()
            .toString()
            .padStart(2, "0")}:${newDate
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${newDate
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;
    };

    const saveEvent = (values: EventForm) => {
        if (values) {
            const newEvent: MyEvent = {
                id: isEditMode && values.id ? values.id : uuidv4(),
                title: values.title,
                start: new Date(values.start),
                end: new Date(values.end),
                people: values.people,
            };

            if (isEditMode && values.id) {
                updateEvent(newEvent);
            } else {
                setEvent(newEvent);
            }
        }
        navigate("/");
    };

    return (
        <>
            <div className="add-event-container">
                <h2>{isEditMode ? "Edit event" : "Add new event"}</h2>
                <form onSubmit={handleSubmit(saveEvent)}>
                    <div className="form-group">
                        <label htmlFor="title">Event Title:</label>
                        <input id="title" {...register("title")} />
                        {errors.title?.message && <p>{errors.title.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="start">Start Date:</label>
                        <input
                            id="start"
                            type="datetime-local"
                            {...register("start")}
                        />
                        {errors.start?.message && <p>{errors.start.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="end">End Date:</label>
                        <input
                            id="end"
                            type="datetime-local"
                            {...register("end")}
                        />
                        {errors.end?.message && <p>{errors.end.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="people">Add People:</label>
                        <input
                            id="people"
                            type="text"
                            {...register("people")}
                        />
                    </div>

                    <button type="submit">
                        {isEditMode ? "Edit Event" : "Add Event"}
                    </button>
                </form>
            </div>
            <a href="/" className="link">
                Go back to calendar
            </a>
        </>
    );
};
