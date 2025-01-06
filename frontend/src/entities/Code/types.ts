export type TCode = {
  id: number;
  value: string;
  status: string;
  student?: string;
  telegram_link?: string;
  created_at: string;
};

export type TCreateCode = {
  value: string;
};
