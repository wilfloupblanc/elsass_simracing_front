import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const cartItemRecipientApiSlice = createApi({
    reducerPath: "cartItemRecipientApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL + "/cartItemRecipient",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    }),
    tagTypes: ["cartItemRecipient"],
    endpoints: build => ({
        getRecipientsByCartItem: build.query({
            query: (cartItemId) => `/by-cart-item/${cartItemId}`,
            providesTags: ["cartItemRecipient"]
        }),
        addRecipient: build.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body
            }),
            invalidatesTags: ["cartItemRecipient"]
        }),
        updateRecipient: build.mutation({
            query: ({id, ...body}) => ({
                url: `/${id}`,
                method: "PUT",
                body
            }),
            invalidatesTags: ["cartItemRecipient"]
        }),
        deleteRecipient: build.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["cartItemRecipient"]
        }),
    })
})

export const {useGetRecipientsByCartItemQuery, useAddRecipientMutation, useUpdateRecipientMutation, useDeleteRecipientMutation} = cartItemRecipientApiSlice