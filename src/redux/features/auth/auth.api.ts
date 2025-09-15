import { baseApi } from "@/redux/baseApi";
import type { IResponse, ISendOtp, IVerifyOtp } from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["USER"],
    }),

    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),

    updateProfile: builder.mutation({
      query: ({ userId, formData }) => ({
        url: `/user/${userId}`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["USER"],
    }),

    updateUserStatus: builder.mutation({
      query: ({ userId, statusData }) => ({
        url: `/user/status/${userId}`,
        method: "PATCH",
        data: statusData,
      }),
      invalidatesTags: ["USER"],
    }),

    sendOtp: builder.mutation<IResponse<null>, ISendOtp>({
      query: (userInfo) => ({
        url: "/otp/send",
        method: "POST",
        data: userInfo,
      }),
    }),

    getAllUsers: builder.query({
      query: () => ({
        url: "/user/all-users",
        method: "GET",
      }),
    }),

    verifyOtp: builder.mutation<IResponse<null>, IVerifyOtp>({
      query: (userInfo) => ({
        url: "/otp/verify",
        method: "POST",
        data: userInfo,
      }),
    }),
    userInfo: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),
    getUserById: builder.query({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "GET",
      }),
      providesTags: ["USER"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useUpdateProfileMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useUserInfoQuery,
  useLogoutMutation,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useGetUserByIdQuery,
} = authApi;
