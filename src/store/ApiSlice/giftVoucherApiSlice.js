import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const giftVoucherApiSlice = createApi({
    reducerPath: "giftVoucherApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL + "/giftVoucher",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        credentials: "include"
    }),
    tagTypes: ["giftVoucher"],
    endpoints: build => ({
        getFreeSession : build.query({
            method: "GET",
            query: () => "/free-session-member",
            providesTags: ["giftVoucher"],
        })
    })
})

export const {useGetFreeSessionQuery} = giftVoucherApiSlice
export const { resetApiState } = giftVoucherApiSlice.util