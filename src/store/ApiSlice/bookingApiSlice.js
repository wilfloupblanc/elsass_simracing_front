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
        }),
        getMyBookings: build.query({
            query: () => "/me",
            providesTags: ["booking"]
        }),
        cancelBooking: build.mutation({
            query: (id) => ({
                url: `/cancel/${id}`,
                method: "POST",
            }),
            invalidatesTags: ["booking"]
        })
    })
})
export const {
    useCreateBookingMutation,
    useGetBookingByIdQuery,
    useGetMyBookingsQuery,
    useCancelBookingMutation
} = bookingApiSlice
export const { resetApiState } = bookingApiSlice.util