export type ForgotPasswordRequest = { email: string };

export type ForgotPasswordConfirmRequest = {
  new_password: string;
  confirm_password: string;
  token: string;
  setIsValidToken: (state: boolean) => void;
};

export type ForgotPasswordConfirmResponse = { token: string };
