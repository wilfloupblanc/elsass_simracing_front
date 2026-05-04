import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const contactApiSlice = createApi({
    reducerPath: "contactApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL + "/contact",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        credentials: "include"
    }),
    tagTypes: ["contact"],
    endpoints: build => ({
        sendMail: build.mutation({
            query: (body) => ({
                url: "/mail",
                method: "POST",
                body
            })
        })
    })
})

export const {useSendMailMutation} = contactApiSlice