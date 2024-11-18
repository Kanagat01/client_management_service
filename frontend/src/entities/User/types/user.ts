export type TUserType =
  | "customer_company"
  | "customer_manager"
  | "transporter_company"
  | "transporter_manager"
  | "driver";

export type TUser = {
  user_id: number;
  email: string;
  user_type: TUserType;
  full_name: string;
};

export const getRole = (userType: TUserType | "") =>
  ["customer_manager", "customer_company"].includes(userType)
    ? "customer"
    : "transporter";
