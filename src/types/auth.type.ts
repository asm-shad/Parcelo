export interface ISendOtp {
  email: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse {
  email: string;
  token: string;
  isVerified: boolean;
  // any other fields
}

export interface IVerifyOtp {
  email: string;
  otp: string;
}
