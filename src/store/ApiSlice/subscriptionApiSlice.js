import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
export const subscriptionApiSlice = createApi({
    reducerPath: "subscriptionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL + "/subscription",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    }),
    tagTypes: ["subscription"],
    endpoints: build => ({
        getSubscriptions: build.query({
            query: () => "/",
            providesTags: ["subscription"]
        }),
        getMySubscription: build.query({
            query: () => "/me",
            providesTags: ["subscription"]
        }),
        subscribe: build.mutation({
            query: (plan) => ({
                url: "/subscribe",
                method: "POST",
                body: { plan }
            }),
            invalidatesTags: ["subscription"]
        }),
        cancelSubscription: build.mutation({
            query: () => ({
                url: "/cancel",
                method: "POST",
            }),
            invalidatesTags: ["subscription"]
        }),
        reactivateSubscription: build.mutation({
            query: () => ({
                url: "/reactivate",
                method: "POST",
            }),
            invalidatesTags: ["subscription"]
        }),
        changePlan: build.mutation({
            query: (plan) => ({
                url: "/change-plan",
                method: "PATCH",
                body: { plan }
            }),
            invalidatesTags: ["subscription"]
        }),
    })
})
export const {
    useGetSubscriptionsQuery,
    useGetMySubscriptionQuery,
    useSubscribeMutation,
    useCancelSubscriptionMutation,
    useReactivateSubscriptionMutation,
    useChangePlanMutation
} = subscriptionApiSlice