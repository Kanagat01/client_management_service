import { useEffect } from "react";
import { useUnit } from "effector-react";
import { CommandBar } from "~/widgets";
import {
  $messages,
  CreateMessage,
  getMessagesFx,
  getMessageColumns,
} from "~/entities/Message";
import { $students, getStudentsFx } from "~/entities/Student";
import { $groups, getGroupsFx } from "~/entities/Group";
import { RenderPromise } from "~/shared/api";
import { MainTable } from "~/shared/ui";

const menuList = [<CreateMessage />];

export function MessagesPage() {
  const data = useUnit($messages);
  const columns = getMessageColumns();

  useEffect(() => {
    if ($students.getState().length === 0) getStudentsFx();
    if ($groups.getState().length === 0) getGroupsFx();
  }, []);
  return (
    <>
      <CommandBar title="Список отправленных сообщений" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getMessagesFx, {
            success: <MainTable data={data} columns={columns} />,
          })}
        </div>
      </div>
    </>
  );
}
