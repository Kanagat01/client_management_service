import { BiFilterAlt } from "react-icons/bi";
import { MdRestartAlt } from "react-icons/md";
import { Checkbox } from "~/shared/ui";
import styles from "./styles.module.scss";

type AddStudentsProps = {
  inputs1: string[];
  checkboxInputs: string[];
};

export const AddStudents = ({ inputs1, checkboxInputs }: AddStudentsProps) => {
  return (
    <>
      <div className={styles.studentConteiner}>
        <div className={styles.addStudent}>
          <div>
            <span>Записи на странице</span>
            <p>15</p>
          </div>
          {inputs1.map((el) => (
            <div>
              <span>{el}</span>
              <input type="text" />
            </div>
          ))}
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
