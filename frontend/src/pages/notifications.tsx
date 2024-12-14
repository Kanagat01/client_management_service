import { Button } from "react-bootstrap";
import { BsEye, BsTrash } from "react-icons/bs";
import { CommandBar } from "~/widgets";

const menuList = [
  <Button variant="link" className="icon-link" disabled>
    <BsTrash />
    Удалить все
  </Button>,
  <Button variant="link" className="icon-link" disabled>
    <BsEye />
    Отметить все как прочтенное
  </Button>,
];

export function NotificationsPage() {
  return (
    <>
      <CommandBar
        title="Уведомления"
        subtitle="Важные события, за которыми вы следите"
        menuList={menuList}
      />
      <form
        id="post-form"
        className="mb-md-4 h-100"
        method="post"
        encType="multipart/form-data"
      >
        <div className="bg-white rounded shadow-sm mb-3">
          {/* <MainTable table={table} /> */}
        </div>
      </form>
    </>
  );
}
