import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {showToast} from "@store/slice/toastSlice.js"

export const authApiSlice = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL + "/auth",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        credentials: "include"
    }),
    tagTypes: ["auth"],
    endpoints: build => ({
        getAuthenticatedUser: build.query({
            method: "GET",
            query: () => "/user",
            providesTags: ["auth"]
        }),
        signOut: build.mutation({
            query: () => ({
                url: "/sign-out",
                method: "GET",
            }),
            invalidatesTags: ["auth"]
        }),
        getRefreshToken: build.mutation({
            query: (id) => ({
                url: "/refresh-token",
                method: "GET",
                id
            }),
            invalidatesTags: ["auth"]
        }),
        signUp: build.mutation({
            query: (body) => ({
                url: "/sign-up",
                method: "POST",
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    dispatch(showToast({message: "Vous êtes bien inscrit !", type: "success"}));
                    dispatch(authApiSlice.util.upsertQueryData("getAuthenticatedUser", undefined, data.user))
                } catch(_error) {
                    dispatch(showToast({message: "Une erreur est survenue, veuillez réessayer !", type: "error"}))
                }
            }
        }),
        signIn: build.mutation({
            query: (body) => ({
                url: "/sign-in",
                method: "POST",
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(authApiSlice.util.invalidateTags(["auth"]))
                } catch {}
            }
        }),
        updateAccount: build.mutation({
            query: ({id, ...body}) => ({
                url: "/update-account" + id,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["auth"]
        }),
        forgotPassword: build.mutation({
            query: (body) => ({
                url: "/forgot-password",
                method: "POST",
                body
            }),
            invalidatesTags: ["auth"]
        }),
        resetPassword: build.mutation({
            query: (body) => ({
                url: "/reset-password",
                method: "POST",
                body
            }),
            invalidatesTags: ["auth"]
        }),
        deleteAccount: build.mutation({
            query: (id) => ({
                url: "/delete-account" + id,
                method: "DELETE",
            }),
            invalidatesTags: ["auth"]
        })
    })
})

export const {useGetAuthenticatedUserQuery, useSignOutMutation, useGetRefreshTokenMutation, useSignUpMutation, useSignInMutation, useUpdateAccountMutation, useDeleteAccountMutation, useForgotPasswordMutation, useResetPasswordMutation} = authApiSlice
export const { resetApiState } = authApiSlice.util