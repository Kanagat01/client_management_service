import { useUnit } from "effector-react";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { CSSProperties, ChangeEvent, useState, ReactNode } from "react";
import { copyOnClickWrapper, handleClick } from "~/features/copyOnClick";
import { $preCreateOrder, TGetOrder } from "~/entities/Order";
import Routes from "~/shared/routes";
import { dateToString } from "~/shared/lib";
import { InputContainer, RoundedTable, TitleSm } from "~/shared/ui";

const gridContainer: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gridAutoRows: "max-content",
  columnGap: "10px",
  marginBottom: "1rem",
};

export function DataSection({ order }: { order: TGetOrder }) {
  const { t } = useTranslation();
  const preCreateOrder = useUnit($preCreateOrder);
  const transport_body_type = preCreateOrder?.transport_body_types.find(
    (el) => el.id === order.transport_body_type
  );
  const transport_load_type = preCreateOrder?.transport_load_types.find(
    (el) => el.id === order.transport_load_type
  );
  const transport_unload_type = preCreateOrder?.transport_unload_types.find(
    (el) => el.id === order.transport_unload_type
  );
  const [stageIdx, setStageIdx] = useState(0);
  const {
    load_stage,
    unload_stage,
    order_stage_number,
    cargo,
    volume,
    weight,
  } = order.stages[stageIdx];
  const inputs = [
    [
      {
        name: "transportation_number",
        label: t("orderTranslations.transportation_number"),
        defaultValue: order.transportation_number,
      },
      {
        name: "customer_manager",
        label: t("common.customer"),
        defaultValue: order.customer_manager.user.full_name,
      },
    ],
    [
      {
        name: "comments_for_transporter",
        label: t("orderTranslations.comments_for_transporter"),
        defaultValue: order.comments_for_transporter,
      },
      {
        name: "additional_requirements",
        label: t("orderTranslations.additional_requirements_short"),
        defaultValue: order.additional_requirements,
      },
    ],
    [
      {
        name: "transport_body_height",
        label: t("orderTranslations.transport_body_height"),
        defaultValue: order.transport_body_height,
      },
      {
        name: "transport_body_length",
        label: t("orderTranslations.transport_body_length"),
        defaultValue: order.transport_body_length,
      },
      {
        name: "transport_body_width",
        label: t("orderTranslations.transport_body_width"),
        defaultValue: order.transport_body_width,
      },
    ],
  ];
  let tableData: [ReactNode, ReactNode][] = [
    [t("orderTranslations.start_price"), order.start_price],
    [t("orderTranslations.price_step"), order.price_step],
    [t("orderTranslations.transport_body_type"), transport_body_type?.name],
    [t("orderTranslations.transport_load_type"), transport_load_type?.name],
    [t("orderTranslations.transport_unload_type"), transport_unload_type?.name],
    [t("orderTranslations.transport_volume"), order.transport_volume],
    [t("orderTranslations.temp_mode"), order.temp_mode],
    [t("orderTranslations.adr"), order.adr],
  ];
  if (order.driver) {
    tableData.push(
      ...([
        [
          t("driverProfileTranslations.phone_number"),
          order.driver.phone_number,
        ],
        [t("driverProfileTranslations.full_name"), order.driver.user.full_name],
        [
          t("driverProfileTranslations.passport_number"),
          order.driver.passport_number,
        ],
        [
          t("driverProfileTranslations.machine_data"),
          order.driver.machine_data,
        ],
        [
          t("driverProfileTranslations.machine_number"),
          order.driver.machine_number,
        ],
      ] as [ReactNode, ReactNode][])
    );
  }
  tableData = tableData.map(([field, value]) => [
    field,
    value ? copyOnClickWrapper(value) : "-",
  ]);
  if (Routes.FIND_CARGO === useLocation().pathname) {
    tableData.splice(0, 2);
  }
  return (
    <>
      {inputs.map((arr, key) => (
        <div
          key={key}
          className="d-flex align-items-end"
          style={{ gap: "1rem" }}
        >
          {arr.map(({ name, label, defaultValue }) => (
            <InputContainer
              {...{ key: name, name, label, defaultValue: defaultValue ?? "-" }}
              variant={key === 1 ? "textarea" : "input"}
              labelStyle={{
                color: "var(--default-font-color)",
              }}
              containerStyle={{
                width: "100%",
                marginBottom: "1rem",
              }}
              className="w-100"
              onClick={defaultValue ? handleClick : undefined}
              readOnly
            />
          ))}
        </div>
      ))}
      <TitleSm>{t("common.table")}</TitleSm>
      <RoundedTable data={tableData} />
      <div className="gray-bg">
        <div style={gridContainer}>
          <TitleSm className="ms-2 mb-2" style={{ fontWeight: 600 }}>
            <div className="d-flex align-items-center justify-content-between">
              {t("orderStage.singular")}{" "}
              <span className="gray-text">
                <InputContainer
                  variant="select"
                  label=""
                  name=""
                  value={stageIdx}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setStageIdx(Number(e.target.value))
                  }
                  options={order.stages.map((_, idx) => [
                    idx,
                    `${idx + 1}/${order.stages.length}`,
                  ])}
                  style={{ width: "fit-content", padding: "2px" }}
                />
              </span>
            </div>
          </TitleSm>
          <TitleSm className="ms-2 mb-2" style={{ fontWeight: 600 }}>
            {t("orderStage.stageNumber")}:{" "}
            <span className="gray-text">
              {copyOnClickWrapper(order_stage_number)}
            </span>
          </TitleSm>
          {[t("orderStage.loadingStage"), t("orderStage.unloadingStage")].map(
            (text) => (
              <TitleSm
                key={text}
                className="position-relative ms-2 mb-2"
                style={{ fontWeight: 600 }}
              >
                {text}
              </TitleSm>
            )
          )}
          {[load_stage, unload_stage].map((stage, key) => (
            <RoundedTable
              key={key}
              data={[
                [
                  copyOnClickWrapper(
                    <>
                      {stage.company}
                      <br />
                      {stage.city}, {stage.postal_code}
                      <br />
                      {stage.address}
                    </>
                  ),
                ],
                [copyOnClickWrapper(stage.contact_person)],
                [
                  copyOnClickWrapper(
                    <>
                      {dateToString(stage.date)} <br />
                      {stage.time_start.slice(0, 5)}-
                      {stage.time_end.slice(0, 5)}
                    </>
                  ),
                ],
              ]}
            />
          ))}
          {[1, 2].map((key) => (
            <div
              key={key}
              className="d-flex flex-column justify-content-between"
            >
              <TitleSm className="mt-4 mb-2" style={{ fontWeight: 600 }}>
                {t("orderTranslations.cargo_parameters")} -{" "}
                {copyOnClickWrapper(cargo)}
              </TitleSm>
              <div className="gray-line" />
            </div>
          ))}
          {[1, 2].map((key) => (
            <div key={key}>
              <div className="d-flex justify-content-between mt-2">
                <TitleSm className="gray-text">
                  {t("orderTranslations.weight")}
                </TitleSm>
                <TitleSm>{copyOnClickWrapper(`${weight} kg`)}</TitleSm>
              </div>
              <div className="d-flex justify-content-between mt-1">
                <TitleSm className="gray-text">
                  {t("orderTranslations.volume")}
                </TitleSm>
                <TitleSm>{copyOnClickWrapper(`${volume} cbm`)}</TitleSm>
              </div>
            </div>
          ))}
          {[load_stage, unload_stage].map((stage, key) => (
            <div key={key}>
              <TitleSm className="mt-4 mb-2" style={{ fontWeight: 600 }}>
                {t("orderStageTranslations.comments")}
              </TitleSm>
              <div className="gray-line mb-2" />
              <TitleSm>
                {stage.comments ? copyOnClickWrapper(stage.comments) : "—"}
              </TitleSm>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
