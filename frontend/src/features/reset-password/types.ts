export type ForgotPasswordRequest = { email: string };

export type ResetPasswordConfirmRequest = {
  new_password: string;
  confirm_password: string;
  token: string;
  setIsValidToken: (state: boolean) => void;
};

export type ResetPasswordConfirmResponse = { token: string };
