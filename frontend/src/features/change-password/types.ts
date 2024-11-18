export type ChangePasswordRequest = {
  old_password: string;
  new_password: string;
  repeat_password: string;
};

export type ChangePasswordResponse = { token: string };
