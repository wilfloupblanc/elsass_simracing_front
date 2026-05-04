import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const orderApiSlice = createApi ({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL + "/order",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    }),
    tagTypes: ["order"],
    endpoints: build =>  ({
        checkout: build.mutation({
            query: (body) => ({
                url: "/checkout",
                method: "POST",
                body
            })
        }),
        getLastOrder: build.query({
            method: "GET",
            query: () => "/last",
            providesTags: ["order"]
        }),
        getAllOrders: build.query({
            query: () => "/all",
            providesTags: ["order"]
        })
    })
})

export const {useCheckoutMutation, useGetLastOrderQuery, useGetAllOrdersQuery} = orderApiSlice