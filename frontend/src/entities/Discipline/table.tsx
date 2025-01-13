import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DefaultCell, DefaultHeader, useActionsColumn } from "~/shared/ui";
import { CreateOrEditDiscipline } from "./ui";
import { TDiscipline } from "./types";

type TColumn = keyof TDiscipline | "actions";

const disciplineColumns: Record<TColumn, string> = {
  id: "ID",
  name: "Название дисциплины",
  fa_id: "FA ID",
  actions: "Действия",
};

export const getDisciplineColumns = () => {
  const columnHelper = createColumnHelper<TDiscipline>();
  const columns = (
    Object.entries(disciplineColumns) as [TColumn, string][]
  ).map(([fieldName, header], index) =>
    fieldName === "actions"
      ? useActionsColumn<TDiscipline>(columnHelper, header, (row) => [
          <CreateOrEditDiscipline initialState={row} />,
        ])
      : columnHelper.accessor(fieldName, {
          id: `column_${index}`,
          cell: (info) => (
            <DefaultCell>{info.row.original[fieldName]}</DefaultCell>
          ),
          header: () => <DefaultHeader>{header}</DefaultHeader>,
          meta: { label: header },
        })
  );
  return columns as ColumnDef<TDiscipline>[];
};
