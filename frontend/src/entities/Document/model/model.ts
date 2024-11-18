import { t } from "i18next";
import toast from "react-hot-toast";
import { createEvent } from "effector";
import { $selectedOrder, TGetOrder, updateOrder } from "~/entities/Order";
import { AddDocumentRequest, DeleteDocumentRequest } from "./api_types";
import { addDocumentFx, deleteDocumentFx } from "./api";

export const addDocument = createEvent<
  Omit<AddDocumentRequest, "order_id"> & { reset: () => void }
>();
addDocument.watch(({ reset, file }) => {
  const order_id = $selectedOrder.getState()?.id;
  if (!order_id) return;

  const data = new FormData();
  data.append("order_id", order_id.toString());
  data.append("file", file);

  toast.promise(addDocumentFx(data), {
    loading: t("addDocument.loading"),
    success: (newData) => {
      updateOrder({ orderId: order_id, newData });
      reset();
      return t("addDocument.success", { name: file.name });
    },
    error: (err) => {
      if (typeof err === "string") {
        if (err === "OrderModel with this ID does not belong to your company") {
          return t("addDocument.error.orderDoesNotBelong");
        }
      }
      return t("addDocument.error.general", { err });
    },
  });
});

export const deleteDocument = createEvent<
  DeleteDocumentRequest & { reset: () => void }
>();
deleteDocument.watch(({ reset, document_id }) =>
  toast.promise(deleteDocumentFx({ document_id }), {
    loading: t("deleteDocument.loading"),
    success: () => {
      const order = $selectedOrder.getState() as TGetOrder;
      const file =
        order.documents.find((doc) => doc.id === document_id)?.file ?? "";
      const newData = {
        documents: order.documents.filter((doc) => doc.id !== document_id),
      };
      updateOrder({ orderId: order.id, newData });
      reset();

      const docName = decodeURIComponent(file).replace("/media/documents/", "");
      return t("deleteDocument.success", { docId: document_id, docName });
    },
    error: (err) => t("deleteDocument.error", { err }),
  })
);
