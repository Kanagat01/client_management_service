import { TActivity } from "~/entities/Activity";

export type TStudentRecord = {
  id: number;
  student_id: number;
  student: string;
  telegram_link: string;
  activity: TActivity;
  marked_as_proctoring: boolean;
};

export type TCreateStudentRecord = {
  student: number;
  activity: number;
  marked_as_proctoring: boolean;
};

export type TUpdateStudentRecord = Partial<TCreateStudentRecord> & {
  id: number;
};
