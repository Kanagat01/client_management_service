export type RegisterCompanyRequest = {
  email: string;
  password: string;
  full_name: string;
  company_name: string;
  user_type: "customer" | "transporter";
};

export type RegisterManagerRequest = Omit<
  RegisterCompanyRequest,
  "company_name" | "user_type"
>;

export type RegisterResponse = { token: string };
