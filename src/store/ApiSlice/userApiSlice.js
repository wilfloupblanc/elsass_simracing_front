import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const userApiSlice = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL + "/user",
        header: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        credentials: "include"
    }),
    taTypes: ["user"],
    endpoints: build => ({
        getAllUsers: build.query({
            method: "GET",
            query: () => "/all",
            providesTags: ["user"],
            transformResponse: response => response.user,
        }),
        updateUser: build.mutation({
            query: ({id, ...body}) => ({
                url: "/" +id,
                method: "PATCH",
                body
            }),
            invalidatesTags: ["user"]
        }),
        deleteUser: build.mutation({
            query: ({id, ...body}) => ({
                url: "/" +id,
                method: "DELETE",
                body
            }),
            invalidatesTags: ["user"]
        }),
        updatePassword: build.mutation({
            query: (body) => ({
                url: "/update-password",
                method: "PATCH",
                body
            }),
            invalidatesTags: ["user"]
        }),
        updateEmail: build.mutation({
            query: (body) => ({
                url: "/update-email",
                method: "PATCH",
                body
            }),
            invalidatesTags: ["user"]
        })
    })
})

export const {useGetAllUsersQuery, useUpdateUserMutation, useDeleteUserMutation, useUpdatePasswordMutation, useUpdateEmailMutation} = userApiSlice