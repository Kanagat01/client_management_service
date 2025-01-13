export type TUser = {
  username: string;
  email: string;
};

export type TChangePassword = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};
