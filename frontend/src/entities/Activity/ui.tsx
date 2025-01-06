import { useState } from "react";
import { useUnit } from "effector-react";
import { $activityTypes } from "~/entities/ActivityType";
import { $groups } from "~/entities/Group";
import { $disciplines } from "~/entities/Discipline";
import { CreateOrEditBtn, BsInput, SelectInput } from "~/shared/ui";
import { updateActivity } from "./model";
import { TEditActivity } from "./types";

export function EditActivity({
  initialState,
}: {
  initialState: TEditActivity;
}) {
  const activityTypes = useUnit($activityTypes);
  const groups = useUnit($groups);
  const disciplines = useUnit($disciplines);
  const [data, setData] = useState(initialState);

  const onReset = () => setData(initialState);
  const onSubmit = (changeShow: () => void) => {
    updateActivity({ ...(data as TEditActivity), changeShow });
  };
  return (
    <CreateOrEditBtn
      variant="edit"
      title="Редактировать активность"
      inputs={
        <div className="d-flex flex-column" style={{ gap: "1rem" }}>
          <SelectInput
            label="Название активности"
            name="activity_type"
            value={data.activity_type.toString()}
            options={activityTypes.map((type) => ({
              value: type.id.toString(),
              label: type.name,
            }))}
            onChange={(value) =>
              setData({ ...data, activity_type: Number(value) })
            }
            required
          />
          <SelectInput
            label="Дисциплина"
            name="discipline"
            value={data.discipline.toString()}
            options={disciplines.map((discipline) => ({
              value: discipline.id.toString(),
              label: discipline.name,
            }))}
            onChange={(value) =>
              setData({ ...data, discipline: Number(value) })
            }
            required
          />
          <SelectInput
            label="Группа"
            name="group"
            value={data.group.toString()}
            options={groups.map((group) => ({
              value: group.id.toString(),
              label: group.code,
            }))}
            onChange={(value) => setData({ ...data, group: Number(value) })}
            required
          />
          <BsInput
            variant="input"
            label="Заметка"
            name="note"
            value={data.note}
            onChange={(e) => setData({ ...data, note: e.target.value })}
          />
          <BsInput
            variant="input"
            label="Лектор"
            name="teacher"
            value={data.teacher}
            onChange={(e) => setData({ ...data, teacher: e.target.value })}
            required
          />
          <BsInput
            variant="input"
            label="Дата"
            name="date"
            type="date"
            value={data.date}
            onChange={(e) => setData({ ...data, date: e.target.value })}
            required
          />
          <BsInput
            variant="input"
            label="Время начала"
            name="start_time"
            type="time"
            value={data.start_time}
            onChange={(e) => setData({ ...data, start_time: e.target.value })}
            required
          />
          <BsInput
            variant="input"
            label="Время окончания"
            name="end_time"
            type="time"
            value={data.end_time}
            onChange={(e) => setData({ ...data, end_time: e.target.value })}
            required
          />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
    />
  );
}
