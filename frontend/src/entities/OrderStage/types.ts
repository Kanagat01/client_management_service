export type CargoParams = {
  cargo: string;
  weight: number;
  volume: number;
};

export type OrderStages = {
  id?: number;
  date: string;
  time_start: string;
  time_end: string;
  company: string;
  postal_code: string;
  city: string;
  address: string;
  contact_person: string;
  completed: boolean;
  comments?: string;
};

export type OrderStageKey = keyof Omit<OrderStages, "id" | "completed">;

export type TStages = {
  id?: number;
  order_stage_number: number;
  load_stage: OrderStages;
  unload_stage: OrderStages;
} & CargoParams;

export type TStage = "load_stage" | "unload_stage";

type NameType = {
  id: number;
  name: string;
};

export type OrderTransportBodyType = NameType;
export type OrderTransportLoadType = NameType;
export type OrderTransportUnloadType = NameType;
