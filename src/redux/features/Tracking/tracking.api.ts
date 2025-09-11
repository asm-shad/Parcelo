import { baseApi } from "@/redux/baseApi";

export const TrackingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrackingDetails: builder.query({
      query: () => ({
        url: "/parcel/track/:trackingId",
        method: "GET",
      }),
      transformResponse: (res) => res.data,
    }),
  }),
});

export const { useGetTrackingDetailsQuery } = TrackingApi;
