import React from "react";
// import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoTrashOutline, IoAddCircleOutline } from "react-icons/io5";
import { PiShareFatThin } from "react-icons/pi";
import { Sidebar, AddStudents } from "~/widgets";
import { Header } from "~/shared/ui";

const StudentsPage: React.FC = () => {
  // const headers = [
  //   "Студент",
  //   "Ссылка",
  //   "Логин",
  //   "Пароль",
  //   "Группа",
  //   "Телефон",
  //   "Верифицирован",
  //   "Дата/время регистрации",
  //   "Действия",
  // ];
  // const rows = [
  //   [
  //     "Андрей Андреев",
  //     "https://t.me/andreww",
  //     "andrew123",
  //     "123456",
  //     "ДЛПУ23-1",
  //     "79388683993",
  //     false,
  //     "29-08-2024 09:18",
  //     <HiOutlineDotsVertical />,
  //   ],
  //   [
  //     "Павел Павлов",
  //     "https://t.me/pavel_p",
  //     "pav123",
  //     "654321",
  //     "ДЭФР21-1с",
  //     "79066261206",
  //     true,
  //     "30-08-2024 01:27",
  //     <HiOutlineDotsVertical />,
  //   ],
  //   [
  //     "Мария Иванова",
  //     "https://t.me/masha",
  //     "masha567",
  //     "abcdef",
  //     "ДММ20-1",
  //     "79011234567",
  //     true,
  //     "31-08-2024 15:55",
  //     <HiOutlineDotsVertical />,
  //   ],
  //   [
  //     "Иван Иванов",
  //     "https://t.me/ivanivan",
  //     "ivan_ivan",
  //     "password1",
  //     "ДМФ22-1",
  //     "79121234567",
  //     false,
  //     "31-08-2024 21:28",
  //     <HiOutlineDotsVertical />,
  //   ],
  //   [
  //     "Ксения Петрова",
  //     "https://t.me/ksenia",
  //     "ksenia_pet",
  //     "qwerty",
  //     "ДЭР22-1",
  //     "79991234567",
  //     true,
  //     "01-09-2024 01:40",
  //     <HiOutlineDotsVertical />,
  //   ],
  //   [
  //     "Николай Сидоров",
  //     "https://t.me/nikolay",
  //     "kolya123",
  //     "123qwe",
  //     "ДЭГМ20-1",
  //     "79876543210",
  //     false,
  //     "01-09-2024 21:35",
  //     <HiOutlineDotsVertical />,
  //   ],
  //   [
  //     "Светлана Козлова",
  //     "https://t.me/svetlana",
  //     "sveta",
  //     "pass123",
  //     "ДММ23-1",
  //     "79129876543",
  //     true,
  //     "02-09-2024 12:59",
  //     <HiOutlineDotsVertical />,
  //   ],
  //   [
  //     "Олег Тихонов",
  //     "https://t.me/oleg",
  //     "oleg89",
  //     "987654",
  //     "ДЭФР20-1",
  //     "79019876543",
  //     false,
  //     "02-09-2024 13:15",
  //     <HiOutlineDotsVertical />,
  //   ],
  //   [
  //     "Анна Смирнова",
  //     "https://t.me/anna",
  //     "anna123",
  //     "654321a",
  //     "ДЭМ20-1",
  //     "79874561234",
  //     true,
  //     "02-09-2024 14:20",
  //     <HiOutlineDotsVertical />,
  //   ],
  //   [
  //     "Максим Максимов",
  //     "https://t.me/max",
  //     "maxim123",
  //     "abcdefg",
  //     "ДМР22-1",
  //     "79675461234",
  //     false,
  //     "02-09-2024 15:45",
  //     <HiOutlineDotsVertical />,
  //   ],
  // ];

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        {/* Здесь будет основной контент */}
        <Header title="Данные студентов">
          <button>
            <IoTrashOutline />
            Очистить данные студентов
          </button>
          <div className="export-add-wrapper">
            <button>
              <IoAddCircleOutline />
              Добавить
            </button>
            <button>
              <PiShareFatThin />
              Экспорт
            </button>
          </div>
        </Header>
        <AddStudents
          inputs1={[
            {
              label: "TG ID",
              key: "tg_id",
            },
            {
              label: "Телефон",
              key: "phone",
            },
            {
              label: "Группа",
              key: "group",
            },
            {
              label: "Логин",
              key: "login",
            },
          ]}
          checkboxInputs={["Верифицирован"]}
        />
      </div>
    </div>
  );
};

export default StudentsPage;
