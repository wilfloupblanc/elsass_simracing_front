import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const planApiSlice = createApi({
    reducerPath: 'planApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL + "/plan",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    }),
    tagTypes: ['plan'],
    endpoints: build => ({
        getAllPlans: build.query({
            query: () => "/",
            providesTags: ["plan"]
        })
    })
})

export const {useGetAllPlansQuery} = planApiSlice