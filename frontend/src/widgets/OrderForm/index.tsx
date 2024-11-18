import { useEffect } from "react";
import { useMatch } from "react-router";
import { useUnit } from "effector-react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  $orderForm,
  clearForm,
  orderFormSubmitted,
  OrderStagesTable,
  TInputs,
  OrderStageForm,
  initialOrder,
  orderToOrderForm,
} from "~/features/create-order";
import { PreCreateOrderResponse } from "~/entities/OrderStage";
import Routes from "~/shared/routes";
import { Field, SelectField } from "./inputs";
import styles from "./styles.module.scss";

const inputNamesCol1: (keyof TInputs)[] = [
  "customer_manager",
  "transportation_number",
  "start_price",
  "price_step",
];

const inputNamesCol3: (keyof TInputs)[] = [
  "transport_volume",
  "temp_mode",
  "adr",
  "transport_body_width",
  "transport_body_length",
  "transport_body_height",
];

function mapResponseToOptions(
  responseProperty: { id: number; name: string }[]
): [string, string][] {
  return responseProperty.map((el) => [el.id.toString(), el.name]);
}

function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== typeof obj2) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  return true;
}

export function OrderForm(preCreateOrder: PreCreateOrderResponse) {
  const { t } = useTranslation();
  const order = useUnit($orderForm);
  const match = useMatch(Routes.EDIT_ORDER);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      let formHasChanged;
      if (match && preCreateOrder.order)
        formHasChanged = !deepEqual(
          orderToOrderForm(preCreateOrder.order),
          order
        );
      else {
        const initialForm = {
          ...initialOrder,
          transportation_number: preCreateOrder.max_transportation_number,
        };
        formHasChanged = !deepEqual(initialForm, order);
      }
      if (formHasChanged) {
        event.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [order, match, preCreateOrder.order]);

  return (
    <form
      className="p-4"
      onSubmit={orderFormSubmitted}
      onReset={() => clearForm}
    >
      <Row>
        <Col md={6} lg={3} className="mb-4">
          <div className={styles.title}>{t("common.customer")}</div>
          {inputNamesCol1.map((name) => (
            <Field
              key={name}
              name={name}
              value={order[name] as string | number}
              colNum={1}
            />
          ))}
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <div className={styles.title}>{t("orders.additional")}</div>
          <div className={styles.secondCol}>
            <Field
              name="comments_for_transporter"
              value={order.comments_for_transporter ?? ""}
              colNum={2}
            />
            <Field
              name="additional_requirements"
              value={order.additional_requirements ?? ""}
              colNum={2}
            />
          </div>
        </Col>
        <Col md={12} lg={5} className="mb-4">
          <div className={styles.title}>{t("orders.transport")}</div>
          <Row>
            <SelectField
              name="transport_body_type"
              value={order.transport_body_type as number}
              options={mapResponseToOptions(
                preCreateOrder.transport_body_types
              )}
            />
            <SelectField
              name="transport_load_type"
              value={order.transport_load_type as number}
              options={mapResponseToOptions(
                preCreateOrder.transport_load_types
              )}
            />
            <SelectField
              name="transport_unload_type"
              value={order.transport_unload_type as number}
              options={mapResponseToOptions(
                preCreateOrder.transport_unload_types
              )}
            />
          </Row>
          <Row>
            {inputNamesCol3.map((name) => (
              <Field
                key={name}
                name={name}
                value={order[name] ?? ""}
                colNum={3}
              />
            ))}
          </Row>
        </Col>
        <Col lg={8} md={12}>
          <OrderStagesTable orderStages={order.stages} />
        </Col>
        <Col lg={4} md={12}>
          <div className="ms-3">
            <OrderStageForm />
          </div>
        </Col>
      </Row>
    </form>
  );
}
