import { Button } from "react-bootstrap";
import { BsBoxArrowLeft } from "react-icons/bs";
import { useModalState } from "~/shared/lib";
import { ConfirmModal } from "~/shared/ui";
import { logout } from ".";

export function LogoutBtn() {
  const [show, changeShow] = useModalState(false);
  return (
    <>
      <Button variant="link" className="icon-link" onClick={changeShow}>
        <BsBoxArrowLeft />
        Выход
      </Button>
      <ConfirmModal
        show={show}
        changeShow={changeShow}
        content="Вы уверены, что хотите выйти?"
        onConfirm={logout}
      />
    </>
  );
}
