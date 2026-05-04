import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const bookingApiSlice = createApi({
    reducerPath: 'bookingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL + "/booking",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        credentials: "include"
    }),
    tagTypes: ["booking"],
    endpoints: build => ({
        createBooking: build.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body
            }),
            invalidatesTags: ["booking"]
        }),
        getBookingById: build.query({
            query: (id) => `/${id}`,
            providesTags: ["booking"]
        })
    })
})

export const { useCreateBookingMutation, useGetBookingByIdQuery } = bookingApiSlice
export const { resetApiState } = bookingApiSlice.util