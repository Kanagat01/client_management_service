import { CommandBar } from "~/widgets";
import { LogoutBtn } from "~/features/authorization";
import { ChangePassword, EditUserProfile } from "~/entities/User";

const menuList = [<LogoutBtn />];

export function ProfilePage() {
  return (
    <>
      <CommandBar
        title="Мой аккаунт"
        subtitle="Обновите данные своей учетной записи, такие как имя, адрес электронной почты и пароль"
        menuList={menuList}
      />
      <div className="mb-md-4 h-100">
        <div className="row g-0 mb-3">
          <div className="col p-0 px-3">
            <legend className="text-black px-2 mt-2">
              Информация профиля
              <p className="small text-muted mt-2 mb-0 text-balance">
                Обновите информацию профиля вашего аккаунта и адрес электронной
                почты.
              </p>
            </legend>
          </div>
          <EditUserProfile />
        </div>

        <div className="row g-0 mb-3">
          <div className="col p-0 px-3">
            <legend className="text-black px-2 mt-2">
              Смена пароля
              <p className="small text-muted mt-2 mb-0 text-balance">
                Убедитесь, что в вашей учетной записи используется длинный
                случайный пароль, чтобы оставаться в безопасности.
              </p>
            </legend>
          </div>
          <ChangePassword />
        </div>
      </div>
    </>
  );
}
