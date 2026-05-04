import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const availabilityApiSlice = createApi({
    reducerPath: "availability",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL + "/availability",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        credentials: "include"
    }),
    tagTypes: ["availability"],
    endpoints: build => ({
        getAvailabilities: build.query({
            method: "GET",
            query: () => "/",
            providesTags: ["availability"]
        }),
        getAvailabilitiesByMonth: build.query({
            method: "GET",
            query: (month) => `/month?month=${month}`,
            providesTags: ["availability"]
        })
    })
})

export const {useGetAvailabilitiesQuery, useGetAvailabilitiesByMonthQuery} = availabilityApiSlice
export const {resetApiState} = availabilityApiSlice.util