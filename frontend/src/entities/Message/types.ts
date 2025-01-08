type TMessageBase = {
  id: number;
  text: string;
  schedule_datetime: string;
  is_sent: boolean;
};

type TGroupMessage = TMessageBase & {
  group: string;
  group_id: number;
  student?: never;
  student_id?: never;
};

type TStudentMessage = TMessageBase & {
  student: string;
  student_id: number;
  group?: never;
  group_id?: never;
};

export type TMessage = TGroupMessage | TStudentMessage;

export type TCreateMessage = Omit<TMessageBase, "id" | "is_sent"> &
  ({ student: number; group?: never } | { group: number; student?: never });
