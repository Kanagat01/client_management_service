import { useUnit } from "effector-react";
import { Button } from "react-bootstrap";
import { BsCheckCircle } from "react-icons/bs";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BsInput, ConfirmModal } from "~/shared/ui";
import { useModalState } from "~/shared/lib";
import { $userProfile, changePassword, updateUserProfile } from "./model";
import { TChangePassword, TUser } from "./types";

export function EditUserProfile() {
  const userProfile = useUnit($userProfile);
  const [data, setData] = useState(userProfile as TUser);
  useEffect(() => {
    setData(userProfile as TUser);
  }, [userProfile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

  const [show, changeShow] = useModalState(false);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    changeShow();
  };
  return (
    <form className="col-12 col-md-7 shadow-sm h-100" onSubmit={onSubmit}>
      <div className="bg-white d-flex flex-column layout-wrapper rounded-top">
        <div className="mb-3">
          <div className="bg-white rounded shadow-sm p-4 py-4 d-flex flex-column gap-3">
            <BsInput
              label={
                <>
                  Название
                  <sup className="text-danger">*</sup>
                </>
              }
              variant="input"
              name="username"
              placeholder="Название"
              value={data?.username}
              onChange={handleChange}
              max={255}
              required
            />

            <BsInput
              label={
                <>
                  Электронная почта
                  <sup className="text-danger">*</sup>
                </>
              }
              variant="input"
              name="email"
              placeholder="Электронная почта"
              value={data?.email}
              onChange={handleChange}
              type="email"
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-light px-4 py-3 d-flex justify-content-end rounded-bottom gap-2">
        <div>
          <div className="form-group mb-0">
            <button className="btn icon-link btn-default" type="submit">
              <BsCheckCircle />
              Сохранить
            </button>
            <ConfirmModal
              show={show}
              changeShow={changeShow}
              content="Вы уверены, что хотите обновить данные профиля?"
              onConfirm={() => updateUserProfile(data)}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

export function ChangePassword() {
  const [data, setData] = useState<TChangePassword>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

  const [show, changeShow] = useModalState(false);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    changeShow();
  };
  return (
    <form className="col-12 col-md-7 shadow-sm h-100" onSubmit={onSubmit}>
      <div className="bg-white d-flex flex-column layout-wrapper rounded-top">
        <div className="mb-3">
          <div className="bg-white rounded shadow-sm p-4 py-4 d-flex flex-column gap-3">
            <BsInput
              variant="password-input"
              name="current_password"
              label="Текущий пароль"
              value={data.current_password}
              onChange={handleChange}
              placeholder="Укажите текущий пароль"
              hint="Это ваш пароль, установленный на данный момент."
              required
            />

            <BsInput
              variant="password-input"
              name="new_password"
              label="Новый пароль"
              value={data.new_password}
              onChange={handleChange}
              placeholder="Введите пароль, который нужно установить"
              required
            />

            <BsInput
              variant="password-input"
              name="confirm_password"
              label="Подтвердите новый пароль"
              value={data.confirm_password}
              onChange={handleChange}
              placeholder="Подтвердите пароль, который нужно установить"
              hint="Хороший пароль должен содержать не менее 15 или не менее 8 символов, включая цифру и строчную букву."
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-light px-4 py-3 d-flex justify-content-end rounded-bottom gap-2">
        <div>
          <div className="form-group mb-0">
            <Button variant="default" className="icon-link" type="submit">
              <BsCheckCircle />
              Обновить пароль
            </Button>
            <ConfirmModal
              show={show}
              changeShow={changeShow}
              content={"Вы уверены, что хотите обновить пароль?"}
              onConfirm={() => changePassword(data)}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
