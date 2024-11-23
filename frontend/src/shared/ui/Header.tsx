import React from "react";
import { IoTrashOutline, IoAddCircleOutline } from "react-icons/io5";
import { PiShareFatThin } from "react-icons/pi";
import "./header.scss";
const Header = () => {
  return (
    <>
      <div className="header-content">
        <h3>Данные студентов</h3>
        <div className="button-container">
          <button>
            <IoTrashOutline />
            Очистить данные студентов
          </button>
          <button>
            <IoAddCircleOutline />
            Добавить
          </button>
          <button>
            <PiShareFatThin />
            Экспорт
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
