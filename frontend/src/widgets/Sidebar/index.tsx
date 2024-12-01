import React, { useState } from "react";
import styles from "./styles.module.scss";

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

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems: [React.ReactNode, string][] = [
    [
      <>
        <CiMenuBurger /> Данные студентов
      </>,
      "#",
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
      "#",
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
      "#",
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

  console.log(isOpen);
  return (
    <>
      <button
        className={`${styles["menu-btn"]} ${isOpen ? styles.menuBtnOpen : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen ? (
          <CiMenuBurger className={styles.menuIcon} />
        ) : (
          <IoMdClose className={styles.menuIcon} />
        )}
      </button>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
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
          <img src="public/assets/favicon.png" alt="Ava" />
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
