export type TStudent = {
  id: number;
  full_name: string;
  telegram_id: string;
  telegram_link?: string;
  fa_login: string;
  fa_password: string;
  group: string | number | null;
  phone?: string;
  is_verified: boolean;
  is_blocked: boolean;
  registration_date: string;
};

export type TCreateStudent = Omit<
  TStudent,
  "id" | "full_name" | "is_blocked" | "registration_date"
>;
