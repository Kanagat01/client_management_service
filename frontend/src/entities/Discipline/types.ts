export type TDiscipline = {
  id: number;
  name: string;
  fa_id: number;
};

export type TCreateDiscipline = Omit<TDiscipline, "id">;
