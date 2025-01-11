import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  DefaultHeader,
  DefaultCell,
  DeleteBtn,
  useActionsColumn,
} from "~/shared/ui";
import { deleteDiscount } from "./model";
import { TDiscount } from "./types";
import { CreateOrEditDiscount } from "./ui";

type TColumn = keyof TDiscount | "actions";

const columnsRecord: Record<TColumn, string> = {
  id: "ID",
  content: "Содержание",
  actions: "Действия",
};

export const getDiscountColumns = () => {
  const columnHelper = createColumnHelper<TDiscount>();
  const columns = (Object.entries(columnsRecord) as [TColumn, string][]).map(
    ([fieldName, header], index) =>
      fieldName === "actions"
        ? useActionsColumn<TDiscount>(columnHelper, header, (row) => [
            <CreateOrEditDiscount initialState={row} />,
            <DeleteBtn
              content={`Вы уверены, что хотите удалить код #${row.id}?`}
              onConfirm={() => deleteDiscount(row.id)}
            />,
          ])
        : columnHelper.accessor(fieldName, {
            id: `column_${index}`,
            cell: (info) => {
              const fieldValue = info.row.original[fieldName];
              return <DefaultCell>{fieldValue}</DefaultCell>;
            },
            header: () => <DefaultHeader>{header}</DefaultHeader>,
            meta: { label: header },
          })
  );
  return columns as ColumnDef<TDiscount>[];
};
