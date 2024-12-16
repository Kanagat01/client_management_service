export type TActivity = {
  id: number;
  activity_type: string;
  discipline: string;
  group: string;
  note?: string;
  teacher: string;
  date: string;
  time_start: string;
  time_end: string;
  updated_at: string;
  marked_as_proctoring: boolean;
  marked_by_students_as_proctoring: boolean;
};
