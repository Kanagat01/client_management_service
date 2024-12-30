import { useUnit } from "effector-react";
import { CommandBar } from "~/widgets";
import {
  $messages,
  CreateMessage,
  getMessagesFx,
  useMessageTable,
} from "~/entities/Message";
import { MainTable } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";

const menuList = [<CreateMessage />];

export function MessagesPage() {
  const data = useUnit($messages);
  const table = useMessageTable(data);

  return (
    <>
      <CommandBar title="Список отправленных сообщений" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getMessagesFx, {
            success: <MainTable table={table} />,
          })}
        </div>
      </div>
    </>
  );
}
