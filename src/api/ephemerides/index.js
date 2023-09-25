import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const ephemeridesApi = createApi({
    reducerPath: 'pokemonApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.1.14:8080/' }),
    endpoints: (builder) => ({
        getEphemeris: builder.mutation({
            query: (data) => ({
                method: "POST",
                url: "/ephemerides",
                body: JSON.stringify(data),
            }),
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetEphemerisMutation } = ephemeridesApi