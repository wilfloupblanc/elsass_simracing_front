import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const eventApiSlice = createApi({
    reducerPath: "eventApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL + "/event",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    }),
    tagTypes: ["event"],
    endpoints: build => ({
        getEvents: build.query({
            query: () => "/",
            providesTags: ["event"]
        }),
        getEventRegistrations: build.query({
            query: (id) => `/${id}/registrations`,
            providesTags: ["event"]
        }),
    })
})

export const { useGetEventsQuery, useGetEventRegistrationsQuery } = eventApiSlice