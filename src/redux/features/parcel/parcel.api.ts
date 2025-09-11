import { baseApi } from "@/redux/baseApi";

export const parcelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    CreateParcel: builder.mutation({
      query: (parcelInfo) => ({
        url: "/parcel/create",
        method: "POST",
        data: parcelInfo,
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
    getIncomingParcels: builder.query({
      query: () => ({
        url: "/parcel/incoming-parcels",
        method: "GET",
      }),
      providesTags: ["PARCEL"],
      transformResponse: (res) => res.data,
    }),
    confirmDelivery: builder.mutation({
      query: (parcelId) => ({
        url: `/parcel/deliver/${parcelId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["PARCEL"],
    }),
    getAllParcels: builder.query({
      query: () => ({
        url: "/parcel",
        method: "GET",
      }),
      providesTags: ["PARCEL"],
      transformResponse: (res) => res.data,
    }),
    getParcelDetails: builder.query({
      query: (parcelId) => ({
        url: `/parcel/${parcelId}`,
        method: "GET",
      }),
      providesTags: (parcelId) => [{ type: "PARCEL", id: parcelId }],
      transformResponse: (res) => res.data,
    }),
    UpdateParcel: builder.mutation({
      query: ({ parcelId, parcelInfo }) => ({
        url: `/parcel/update/${parcelId}`,
        method: "PATCH",
        data: parcelInfo,
      }),
      invalidatesTags: ["PARCEL"],
    }),
    UpdateParcelStatus: builder.mutation({
      query: ({ parcelId, parcelInfo }) => ({
        url: `/parcel/status/${parcelId}`,
        method: "PATCH",
        data: parcelInfo,
      }),
      invalidatesTags: ["PARCEL"],
    }),
    trackParcel: builder.query({
      query: (trackingId) => ({
        url: `/parcel/track/${trackingId}`,
        method: "GET",
      }),
      providesTags: (trackingId) => [{ type: "PARCEL", id: trackingId }],
    }),
    cancelParcel: builder.mutation({
      query: ({ parcelId }) => ({
        url: `/parcel/cancel/${parcelId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["PARCEL"],
    }),
  }),
});

export const {
  useCreateParcelMutation,
  useGetParcelQuery,
  useGetIncomingParcelsQuery, 
  useConfirmDeliveryMutation, 
  useUpdateParcelMutation,
  useUpdateParcelStatusMutation,
  useGetAllParcelsQuery,
  useGetParcelDetailsQuery,
  useTrackParcelQuery,
  useCancelParcelMutation
} = parcelApi;