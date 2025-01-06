type TBase = {
  id: number;
  note?: string;
  teacher: string;
  date: string;
  start_time: string;
  end_time: string;
  updated_at: string;
};

export type TActivity = TBase & {
  activity_type_id: number;
  activity_type: string;
  discipline_id: number;
  discipline: string;
  group_id: number;
  group: string;
};

export type TEditActivity = TBase & {
  activity_type: number;
  discipline: number;
  group: number;
};
