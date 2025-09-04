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
    getAllParcels: builder.query({
      query: () => ({
        url: "/parcel",
        method: "GET",
      }),
      providesTags: ["PARCEL"],
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
  }),
});

export const {
  useCreateParcelMutation,
  useGetParcelQuery,
  useUpdateParcelMutation,
  useUpdateParcelStatusMutation,
  useGetAllParcelsQuery,
} = parcelApi;
