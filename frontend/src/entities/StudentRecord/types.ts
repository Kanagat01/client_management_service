import { TActivity } from "~/entities/Activity";

export type TStudentRecord = {
  id: number;
  student: string;
  telegram_link: string;
  activity: TActivity;
  marked_as_proctoring: boolean;
};
