import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { InputProps } from ".";
import styles from "./styles.module.scss";

type DatalistInputProps = Omit<InputProps, "variant"> & {
  options: { id: number; value: string }[];
};

export const DatalistInput: FC<DatalistInputProps> = ({
  containerStyle,
  labelStyle,
  options,
  value,
  onChange,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  useEffect(() => {
    const handleItemClick = (id: number) => {
      if (onChange) {
        const fakeEvent = {
          target: { value: id.toString() },
        } as ChangeEvent<HTMLInputElement>;
        onChange(fakeEvent);
      }
      setInputValue(id.toString());
    };

    const results = resultsRef.current;
    if (results) {
      let foundOne = false;
      results.innerHTML = "";
      options.forEach(({ id, value }) => {
        if (id.toString().includes(inputValue) && inputValue !== "") {
          foundOne = true;
          const item = document.createElement("div");
          item.classList.add(styles["res-item"]);
          item.textContent = value;
          item.onclick = () => handleItemClick(id);
          results.appendChild(item);
        }
      });
      if (!foundOne) results.classList.add("d-none");
      else results.classList.remove("d-none");
    }
  }, [inputValue, options]);

  return (
    <div className={styles["input-container"]} style={containerStyle}>
      {props.label && (
        <label htmlFor={props.name} style={labelStyle}>
          {props.label}
        </label>
      )}
      <input {...props} value={inputValue} onChange={handleInputChange} />
      <div
        ref={resultsRef}
        className={`position-relative ${styles.results}`}
      ></div>
    </div>
  );
};
