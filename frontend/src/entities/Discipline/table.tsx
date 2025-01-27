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
  ).map(([fieldName, headerText], index) =>
    fieldName === "actions"
      ? useActionsColumn<TDiscipline>(columnHelper, headerText, (row) => [
          <CreateOrEditDiscipline initialState={row} />,
        ])
      : columnHelper.accessor(fieldName, {
          id: `column_${index}`,
          cell: (info) => (
            <DefaultCell>{info.row.original[fieldName]}</DefaultCell>
          ),
          header: ({ header }) => (
            <DefaultHeader header={header} text={headerText} />
          ),
          meta: { label: headerText },
          enableSorting: true,
        })
  );
  return columns as ColumnDef<TDiscipline>[];
};
