import React from "react";
import { useStore } from "effector-react";
import { $verified, toggleVerified } from "./../model/type";
import "./Checkbox.scss";

const Checkbox: React.FC = () => {
  // Получаем значение из store
  const verified = useStore($verified);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Вызываем событие для обновления store
    toggleVerified(e.target.checked);
  };

  return (
    <label className="checkbox">
      <input
        className="checkbox__input"
        type="checkbox"
        checked={verified}
        onChange={handleChange}
      />
      <span className="checkbox__box"></span>
    </label>
  );
};

export default Checkbox;
