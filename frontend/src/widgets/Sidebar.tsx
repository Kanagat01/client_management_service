import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BsBell,
  BsChevronUp,
  BsEnvelope,
  BsGrid,
  BsList,
  BsPercent,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { SlBookOpen, SlOptions } from "react-icons/sl";
import { PiCodeSimpleBold } from "react-icons/pi";
import { ImUsers } from "react-icons/im";
import { $userProfile } from "~/entities/User";
import Routes from "~/shared/routes";

const navItems: [ReactNode, string, string][] = [
  [<BsList />, "Данные студентов", Routes.STUDENTS],
  [<BsGrid />, "Записи студентов", Routes.STUDENT_RECORDS],
  [<SlBookOpen />, "Типы активностей", Routes.ACTIVITY_TYPES],
  [<BsBell />, "Активности", Routes.ACTIVITIES],
  [<SlBookOpen />, "Дисциплины", Routes.DISCIPLINES],
  [<ImUsers />, "Группы", Routes.GROUPS],
  [<PiCodeSimpleBold />, "Коды", Routes.CODES],
  [<SlOptions />, "Логи", Routes.LOGS],
  [<BsEnvelope />, "Рассылки", Routes.MESSAGES],
  [<BsPercent />, "Акции", Routes.DISCOUNTS],
];

export function Sidebar() {
  const userProfile = useUnit($userProfile);

  const currentUrl = useLocation().pathname;
  const currentSection = navItems.find((el) => el[2] === currentUrl);

  const toggleSidebar = () => {
    document.body.classList.toggle("menu-open");
  };
  const closeMobileSidebar = () => {
    if (document.body.classList.contains("menu-open")) {
      document.body.classList.remove("menu-open");
    }
  };
  return (
    <div className="aside col-xs-12 col-xxl-2 bg-dark d-flex flex-column me-auto">
      <header className="d-xl-block p-3 mt-xl-4 w-100 d-flex align-items-center">
        <a
          className="header-toggler d-xl-none me-auto order-first d-flex align-items-center lh-1"
          onClick={toggleSidebar}
          href="#"
        >
          <BsThreeDotsVertical />
          <span className="ms-2">{currentSection && currentSection[1]}</span>
        </a>

        <div className="header-brand order-last">
          <div className="h2 d-flex align-items-center">
            <p className="my-0 d-inline d-xl-block">Campus</p>
          </div>
        </div>
      </header>

      <nav className="aside-collapse w-100 d-xl-flex flex-column collapse-horizontal">
        <div className="divider my-2"></div>

        <ul className="nav flex-column mb-md-1 mb-auto ps-0">
          {navItems.map(([icon, section, url], key) => (
            <li
              key={key}
              className={`nav-item ${currentUrl === url && "active"}`}
            >
              <NavLink
                className="nav-link d-flex align-items-center collapsed icon-link"
                to={url}
                onClick={closeMobileSidebar}
              >
                {icon}
                <span className="mx-2">{section}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="h-100 w-100 position-relative to-top cursor d-none d-md-flex mt-md-5">
          <div className="bottom-left w-100 mb-2 ps-3 overflow-hidden">
            <small className="scroll-to-top">
              <BsChevronUp />
              Наверх
            </small>
          </div>
        </div>

        <footer className="position-sticky bottom-0">
          <div
            className="bg-dark position-relative overflow-hidden"
            style={{ paddingBottom: "10px" }}
          >
            <div className="profile-container d-flex align-items-stretch p-3 rounded lh-sm position-relative overflow-hidden">
              <NavLink
                to={Routes.PROFILE}
                className="col-10 d-flex align-items-center me-3"
                onClick={closeMobileSidebar}
              >
                <img
                  src="assets/images/avatar.png"
                  alt="profile-img"
                  className="thumb-sm avatar b me-3"
                />

                <small className="d-flex flex-column lh-1 col-9">
                  <span className="text-ellipsis text-white">
                    {userProfile?.username}
                  </span>
                  <span className="text-ellipsis text-muted">Пользователь</span>
                </small>
              </NavLink>

              {/* <NavLink
                to={Routes.NOTIFICATIONS}
                className="m-auto d-flex align-items-center btn btn-link position-relative px-1 py-0 h-100"
                onClick={closeMobileSidebar}
              >
                <BsBell color="#fff" />
              </NavLink> */}
            </div>
          </div>
        </footer>
      </nav>
    </div>
  );
}
