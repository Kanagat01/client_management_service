import { TStudent } from "~/entities/Student";

export type TStudentRecord = {
  id: number;
  date: string;
  student: TStudent;
  activity_type: string;
  discipline: string;
};
