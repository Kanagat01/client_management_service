import { BsCheckCircle, BsEye, BsEyeSlash } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { CommandBar } from "~/widgets";
import { LogoutBtn } from "~/features/authorization";

const menuList = [<LogoutBtn />];

export function ProfilePage() {
  return (
    <>
      <CommandBar
        title="Мой аккаунт"
        subtitle="Обновите данные своей учетной записи, такие как имя, адрес электронной почты и пароль"
        menuList={menuList}
      />
      <form id="post-form" className="mb-md-4 h-100" method="post">
        <fieldset className="row g-0 mb-3">
          <div className="col p-0 px-3">
            <legend className="text-black px-2 mt-2">
              Информация профиля
              <p className="small text-muted mt-2 mb-0 text-balance">
                Обновите информацию профиля вашего аккаунта и адрес электронной
                почты.
              </p>
            </legend>
          </div>
          <div className="col-12 col-md-7 shadow-sm h-100">
            <div className="bg-white d-flex flex-column layout-wrapper rounded-top">
              <fieldset className="mb-3">
                <div className="bg-white rounded shadow-sm p-4 py-4 d-flex flex-column gap-3">
                  <div className="form-group">
                    <label className="form-label">
                      Название
                      <sup className="text-danger">*</sup>
                    </label>

                    <div data-controller="input" data-input-mask="">
                      <input
                        className="form-control"
                        name="user[name]"
                        type="text"
                        max="255"
                        required
                        placeholder="Название"
                        value="admin"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Электронная почта
                      <sup className="text-danger">*</sup>
                    </label>

                    <div data-controller="input" data-input-mask="">
                      <input
                        className="form-control"
                        name="user[email]"
                        type="email"
                        required
                        placeholder="Электронная почта"
                        value="admin@admin.com"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="bg-light px-4 py-3 d-flex justify-content-end rounded-bottom gap-2">
              <div>
                <div className="form-group mb-0">
                  <button
                    data-controller="button"
                    data-turbo="true"
                    className="btn  icon-link btn-default"
                    type="submit"
                    form="post-form"
                  >
                    <BsCheckCircle />
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset className="row g-0 mb-3">
          <div className="col p-0 px-3">
            <legend className="text-black px-2 mt-2">
              Смена пароля
              <p className="small text-muted mt-2 mb-0 text-balance">
                Убедитесь, что в вашей учетной записи используется длинный
                случайный пароль, чтобы оставаться в безопасности.
              </p>
            </legend>
          </div>
          <div className="col-12 col-md-7 shadow-sm h-100">
            <div className="bg-white d-flex flex-column layout-wrapper rounded-top">
              <fieldset className="mb-3">
                <div className="bg-white rounded shadow-sm p-4 py-4 d-flex flex-column gap-3">
                  <div className="form-group">
                    <label className="form-label">Текущий пароль</label>

                    <div data-controller="password" className="input-icon">
                      <input
                        type="password"
                        className="form-control"
                        name="old_password"
                        placeholder="Укажите текущий пароль"
                        autoComplete="off"
                      />
                      <div className="input-icon-addon cursor">
                        <span data-password-target="iconShow">
                          <BsEye />
                        </span>

                        <span data-password-target="iconLock" className="none">
                          <BsEyeSlash />
                        </span>
                      </div>
                    </div>

                    <small className="form-text text-muted">
                      Это ваш пароль, установленный на данный момент.
                    </small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Новый пароль</label>

                    <div data-controller="password" className="input-icon">
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        placeholder="Введите пароль, который нужно установить"
                      />
                      <div
                        className="input-icon-addon cursor"
                        data-action="click->password#change"
                      >
                        <span>
                          <BsEye />
                        </span>

                        <span className="none">
                          <BsEyeSlash />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Подтвердите новый пароль
                    </label>

                    <div data-controller="password" className="input-icon">
                      <input
                        type="password"
                        className="form-control"
                        name="password_confirmation"
                        placeholder="Введите пароль, который нужно установить"
                      />
                      <div
                        className="input-icon-addon cursor"
                        data-action="click->password#change"
                      >
                        <span data-password-target="iconShow">
                          <BsEye />
                        </span>

                        <span data-password-target="iconLock" className="none">
                          <BsEyeSlash className="small me-2" />
                        </span>
                      </div>
                    </div>

                    <small className="form-text text-muted">
                      Хороший пароль должен содержать не менее 15 или не менее 8
                      символов, включая цифру и строчную букву.
                    </small>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="bg-light px-4 py-3 d-flex justify-content-end rounded-bottom gap-2">
              <div>
                <div className="form-group mb-0">
                  <Button variant="default" className="icon-link">
                    <BsCheckCircle />
                    Обновить пароль
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    </>
  );
}
