export type TMessage = {
  id: number;
  receiver: string | number;
  text: string;
  schedule_datetime: string;
  is_sent: boolean;
};
