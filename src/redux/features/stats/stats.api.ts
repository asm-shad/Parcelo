import { baseApi } from "@/redux/baseApi";

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserStats: builder.query({
      query: () => ({
        url: "/stats/user",
        method: "GET",
      }),
      providesTags: ["STATS"],
    }),

    getParcelStats: builder.query({
      query: () => ({
        url: "/stats/parcel",
        method: "GET",
      }),
      providesTags: ["STATS"],
    }),
  }),
});

export const { useGetUserStatsQuery, useGetParcelStatsQuery } = statsApi;
