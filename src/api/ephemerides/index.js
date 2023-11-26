import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const baseURL = "http://localhost:8080/";

// Define a service using a base URL and expected endpoints
export const ephemeridesApi = createApi({
    reducerPath: 'ephemeridesApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: baseURL,
        prepareHeaders: (headers) => {
            headers.set("Content-Type", "application/json");
            return headers;
        },
     }),
    endpoints: (builder) => ({
        getEphemeris: builder.mutation({
            query: (data) => ({
                method: "POST",
                url: "/ephemerides",
                body: JSON.stringify(data),
            }),
        }),
        getSatellites: builder.query({
            query: (queryString) => ({
                method: "GET",
                url: "/satellites",
                params: {query: queryString}
            })
        }),
        getTleCount: builder.query({
            query: () => ({
                method: "GET",
                url: "/tlecount",
            })
        })
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetEphemerisMutation, useLazyGetSatellitesQuery, useGetTleCountQuery } = ephemeridesApi