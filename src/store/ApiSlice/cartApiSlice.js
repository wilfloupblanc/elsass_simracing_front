import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const cartApiSlice = createApi({
    reducerPath: "cartApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    }),
    tagTypes: ["cart"],
    endpoints: build => ({
        getCart: build.query({
            method: "GET",
            query: () => "/cart/",
            providesTags: ["cart"],
            transformResponse: response => response.items
        }),
        deleteCart: build.mutation({
            query: () => ({
                url: "/cart/",
                method: "DELETE",
            }),
            invalidatesTags: ["cart"]
        }),
        addCartItems: build.mutation({
            query: (body) => ({
                url: "/cartItems/",
                method: "POST",
                body
            }),
            invalidatesTags: ["cart"]
        }),
        updateCartItems: build.mutation({
            query: ({id, ...body}) => ({
                url: "/cartItems/" + id,
                method: "PATCH",
                body
            }),
            invalidatesTags: ["cart"]
        }),
        deleteCartItems: build.mutation({
            query: (id) => ({
                url: "/cartItems/" + id,
                method: "DELETE",
            }),
            invalidatesTags: ["cart"]
        })
    })
})

export const {useGetCartQuery, useDeleteCartMutation, useAddCartItemsMutation, useUpdateCartItemsMutation, useDeleteCartItemsMutation} = cartApiSlice