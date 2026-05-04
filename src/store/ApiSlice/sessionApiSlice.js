import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const sessionApiSlice = createApi({
    reducerPath: "session",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL + "/session",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        credentials: "include"
    }),
    tagTypes: ["session"],
    endpoints: build => ({
        getAllSessions: build.query({
            method: "GET",
            query: () => "/",
            providesTags: ["session"]
        })
    })
})

export const {useGetAllSessionsQuery} = sessionApiSlice
export const {resetApiState} = sessionApiSlice.util