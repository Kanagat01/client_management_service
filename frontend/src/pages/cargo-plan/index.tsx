import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  InputContainer,
  MainTitle,
  OutlineButton,
  RoundedWhiteBox,
  MainTable,
  ScheduleCard,
  TextCenter,
} from "~/shared/ui";

export default function CargoPlan() {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper<any>();
  const keys = [
    "Время",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
  ];

  const columns = keys.map((key) =>
    columnHelper.accessor(key, {
      cell: (info) =>
        key === "Время" ? (
          <TextCenter>{info.getValue()}</TextCenter>
        ) : (
          <ScheduleCard {...info.getValue()} />
        ),
      header: () => <TextCenter>{key}</TextCenter>,
    })
  );
  const defaultData = [
    {
      Время: "08:00 - 08:30",
      Понедельник: {
        status: "delay",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Вторник: {
        status: "departure",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Среда: {
        status: "arrival",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Четверг: {
        status: "loading",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Пятница: {
        status: "departure",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Суббота: {
        status: "delay",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Воскресенье: {
        status: "empty",
      },
    },
    {
      Время: "08:00 - 08:30",
      Понедельник: {
        status: "delay",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Вторник: {
        status: "departure",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Среда: {
        status: "arrival",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Четверг: {
        status: "loading",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Пятница: {
        status: "departure",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Суббота: {
        status: "delay",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Воскресенье: {
        status: "empty",
      },
    },
    {
      Время: "08:00 - 08:30",
      Понедельник: {
        status: "delay",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Вторник: {
        status: "departure",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Среда: {
        status: "arrival",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Четверг: {
        status: "loading",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Пятница: {
        status: "departure",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Суббота: {
        status: "delay",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Воскресенье: {
        status: "empty",
      },
    },
    {
      Время: "08:00 - 08:30",
      Понедельник: {
        status: "delay",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Вторник: {
        status: "departure",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Среда: {
        status: "arrival",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Четверг: {
        status: "loading",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Пятница: {
        status: "departure",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Суббота: {
        status: "delay",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Воскресенье: {
        status: "empty",
      },
    },
    {
      Время: "08:00 - 08:30",
      Понедельник: {
        status: "delay",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Вторник: {
        status: "departure",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Среда: {
        status: "arrival",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Четверг: {
        status: "loading",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Пятница: {
        status: "departure",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Суббота: {
        status: "delay",
        transportation_number: "0000000000",
        transporter_manager: "Патрашков А.В.",
        some_number: "K669XT174/BX577575",
        phone_number: "+79823141388",
      },
      Воскресенье: {
        status: "empty",
      },
    },
  ];
  const [data, setData] = useState(defaultData);
  useEffect(() => setData(defaultData), []);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <RoundedWhiteBox>
      <div className="p-5">
        <MainTitle>{t("orders.pages.cargoPlan")}</MainTitle>
        <div className="control-panel">
          {[
            ["", "Пункт погрузки", "Пункт погрузки"],
            ["", "Дата", "04.07.2023"],
          ].map(([name, label, placeholder], idx) => (
            <InputContainer
              key={idx}
              variant="input"
              containerStyle={{ justifyContent: "end" }}
              name={name}
              label={label}
              placeholder={placeholder}
            />
          ))}
          <div className="actions flex-row">
            {[
              ["Прибытие", "Закрыть для перевозчика"],
              [t("orderStage.loadingStage"), "Открыть для перевозчика"],
              ["Отбытие"],
              ["Проблема", "Подать данные"],
            ].map((arr, key) => (
              <div
                key={key}
                className="d-inline-flex flex-column"
                style={{ gap: "0.8rem", maxWidth: "13rem" }}
              >
                {arr.map((text, idx) => (
                  <OutlineButton
                    key={idx}
                    className={
                      idx === 1 && [0, 1].includes(key)
                        ? "px-4 me-3"
                        : "px-4 py-2 me-3"
                    }
                    style={{
                      lineHeight: "1.4rem",
                      height: key !== 2 ? "-webkit-fill-available" : "",
                    }}
                  >
                    {text}
                  </OutlineButton>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <MainTable table={table} />
    </RoundedWhiteBox>
  );
}
