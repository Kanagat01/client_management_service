import { TActivity } from "~/entities/Activity";

export type TStudentRecord = {
  id: number;
  student: string;
  telegram_link: string;
  activity: TActivity;
  date: string;
  time_start: string;
  time_end: string;
};
