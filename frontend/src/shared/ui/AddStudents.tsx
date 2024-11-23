import "./addStudents.scss";
import Checkbox from "./Checkbox";
import { BiFilterAlt } from "react-icons/bi";
import { MdRestartAlt } from "react-icons/md";

const AddStudents = () => {
  return (
    <>
      <div className="studentConteiner">
        <div className="addStudent">
          <div>
            <span>Записи на странице</span>
            <p>15</p>
          </div>
          <div>
            <span>TG ID</span>
            <input type="text" />
          </div>
          <div>
            <span>Группа</span>
            <input type="text" />
          </div>
          <div>
            <span>Логин</span>
            <input type="text" />
          </div>
          <div>
            <span>Телефон</span>
            <input type="text" />
          </div>
        </div>
        <div className="verification-controls">
          <div className="">
            <p>Верифицирован</p>
            <Checkbox />
          </div>
          <div className="buttons-wrapper">
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

export default AddStudents;
