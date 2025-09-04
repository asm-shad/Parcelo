import { baseApi } from "@/redux/baseApi";

export const parcelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    CreateParcel: builder.mutation({
      query: (userInfo) => ({
        url: "/parcel/create",
        method: "POST",
        data: userInfo,
      }),
    }),
    getParcel: builder.query({
      query: () => ({
        url: "/parcel/my-parcels",
        method: "GET",
      }),
      providesTags: ["PARCEL"],
      transformResponse: (res) => res.data,
    }),
  }),
});

export const { useCreateParcelMutation, useGetParcelQuery } = parcelApi;
