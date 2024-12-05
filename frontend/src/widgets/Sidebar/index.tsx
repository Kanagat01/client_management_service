import { FC, ReactNode, useState } from "react";
import {
  IoSettingsOutline,
  IoBookOutline,
  IoCodeOutline,
} from "react-icons/io5";
import { MdOutlineAppRegistration, MdOutlineMailOutline } from "react-icons/md";
import { IoMdNotificationsOutline, IoMdClose } from "react-icons/io";
import { CiMenuBurger } from "react-icons/ci";
import { RiGroupLine } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import urls from "~/shared/routes";
import styles from "./styles.module.scss";

export const Sidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems: [ReactNode, string][] = [
    [
      <>
        <CiMenuBurger /> Данные студентов
      </>,
      urls.STUDENTS,
    ],
    [
      <>
        <MdOutlineAppRegistration /> Записи студентов
      </>,
      "#",
    ],
    [
      <>
        <IoBookOutline /> Типы активностей
      </>,
      "#",
    ],
    [
      <>
        <IoMdNotificationsOutline /> Активность
      </>,
      "#",
    ],
    [
      <>
        <IoBookOutline /> Дисциплины
      </>,
      "#",
    ],
    [
      <>
        <RiGroupLine /> Группы
      </>,
      urls.GROUPS,
    ],
    [
      <>
        <IoCodeOutline /> Коды
      </>,
      "#",
    ],
    [
      <>
        <BsThreeDots /> Логи
      </>,
      urls.LOGS,
    ],
    [
      <>
        <MdOutlineMailOutline /> Сообщения
      </>,
      "#",
    ],
    [
      <>
        <IoSettingsOutline /> Настройки
      </>,
      "#",
    ],
  ];
  return (
    <>
      <button
        className={`${styles["menu-btn"]} ${isOpen ? styles.menuBtnOpen : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CiMenuBurger className={styles.menuIcon} />
      </button>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <button
          className={`${styles["close-btn"]} ${
            isOpen ? styles.menuBtnOpen : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <IoMdClose className={styles.menuIcon} />
        </button>
        <div className={styles.logo}>
          <span>Campus</span>
        </div>
        <nav className={styles.nav}>
          <ul>
            {navItems.map(([sectionTitle, link], key) => (
              <li key={key}>
                <a href={link}>{sectionTitle}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.profile}>
          <img src="assets/favicon.png" alt="Ava" />
          <div>
            <p>admin</p>
            <p className={styles.user}>Пользователь</p>
          </div>
          <IoMdNotificationsOutline fontSize="20px" cursor="pointer" />
        </div>
      </div>
    </>
  );
};
