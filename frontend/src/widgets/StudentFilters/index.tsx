import { ChangeEvent } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { MdRestartAlt } from "react-icons/md";
import { Checkbox } from "~/shared/ui";
import styles from "./styles.module.scss";

type input = {
  label: string;
  key: string;
};

type AddStudentsProps = {
  inputs1: input[];
  checkboxInputs: string[];
};

export const AddStudents = ({ inputs1, checkboxInputs }: AddStudentsProps) => {
  const formatPhoneInput = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const value = input.value.replace(/\D/g, "");
    let formattedValue = "+7 ";
    console.log(value);

    if (value.length > 1) formattedValue += "(" + value.slice(1, 4);
    if (value.length > 4) formattedValue += ") " + value.slice(4, 7);
    if (value.length > 7) formattedValue += "-" + value.slice(7, 9);
    if (value.length > 9) formattedValue += "-" + value.slice(9, 11);

    input.value = formattedValue;
  };
  return (
    <>
      <div className={styles.studentConteiner}>
        <div className={styles.addStudent}>
          <div className={styles.entry}>
            <span>Записи на странице</span>
            <p>15</p>
          </div>
          <div className={styles.filters}>
            {inputs1.map((el, idx) => {
              if (el.key === "phone") {
                return (
                  <div key={idx}>
                    <span>{el.label}</span>
                    <input
                      type="text"
                      name={el.key}
                      onChange={formatPhoneInput}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={idx}>
                    <span>{el.label}</span>
                    <input name={el.key} type="text" />
                  </div>
                );
              }
            })}{" "}
          </div>
        </div>
        <div className={styles["verification-controls"]}>
          {checkboxInputs.map((el) => (
            <div>
              <p>{el}</p>
              <Checkbox />
            </div>
          ))}
          <div className={styles["buttons-wrapper"]}>
            <button>
              <MdRestartAlt />
              Сбросить
            </button>
            <button>
              <BiFilterAlt />
              Применить
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
