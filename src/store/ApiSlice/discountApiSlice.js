import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const discountApiSlice = createApi({
    reducerPath: 'discountApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        }
    }),
    endpoints: build => ({
        validateDiscountCode: build.mutation({
            query: (body) => ({
                url: '/discount-code/validate',
                method: 'POST',
                body
            }),
        }),
    })
})

export const { useValidateDiscountCodeMutation } = discountApiSlice