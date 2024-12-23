import { useState, PropsWithChildren, ReactNode, useRef } from "react";
import { ColumnHelper, Table } from "@tanstack/react-table";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button, Dropdown } from "react-bootstrap";
import { usePopper } from "react-popper";

export const DefaultHeader = ({ children }: PropsWithChildren) => (
  <th className="text-start">
    <div className="d-inline-flex align-items-center">{children}</div>
  </th>
);

export const DefaultCell = ({ children }: PropsWithChildren) => {
  let cell = children;
  switch (typeof children) {
    case "string":
      if (children.startsWith("http")) {
        cell = (
          <div className="form-group mb-0">
            <a
              className="btn btn-link icon-link"
              href={children}
              target="_blank"
            >
              <span>{children}</span>
            </a>
          </div>
        );
      }
      break;
    case "boolean":
      cell = (
        <span className={`me-1 text-${children ? "success" : "danger"}`}>
          ●
        </span>
      );
      break;
  }
  return (
    <td className="text-start text-truncate" colSpan={1}>
      <div>{cell}</div>
    </td>
  );
};

export const useActionsColumn = (
  columnHelper: ColumnHelper<any>,
  header: ReactNode,
  actions: (row: any) => ReactNode[]
) => {
  return columnHelper.display({
    id: "column_actions",
    meta: { label: header },
    header: () => (
      <th className="text-center" style={{ width: "100px" }}>
        <div className="d-inline-flex align-items-center">{header}</div>
      </th>
    ),
    cell: (info) => {
      const buttonRef = useRef<HTMLButtonElement | null>(null);
      const menuRef = useRef<HTMLDivElement | null>(null);
      const { styles, attributes } = usePopper(
        buttonRef.current,
        menuRef.current,
        { strategy: "fixed" }
      );
      return (
        <td className="text-center" colSpan={1} style={{ minWidth: "100px" }}>
          <div className="form-group mb-0">
            <Dropdown>
              <Dropdown.Toggle
                ref={buttonRef}
                as={Button}
                variant="link"
                className="icon-link"
              >
                <BsThreeDotsVertical />
              </Dropdown.Toggle>

              <Dropdown.Menu
                ref={menuRef}
                style={{ ...styles.popper }}
                {...attributes.popper}
                popperConfig={{ strategy: "fixed" }}
              >
                {actions(info.row.original).map((action, key) => (
                  <div key={key} className="form-group mb-0">
                    {action}
                  </div>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </td>
      );
    },
  });
};

export const ColumnSelector = ({ table }: { table: Table<any> }) => {
  const allColumns = table.getAllColumns();

  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(
    allColumns.reduce((acc, column) => {
      acc[column.id] = column.getIsVisible();
      return acc;
    }, {} as Record<string, boolean>)
  );

  const columnLabels = allColumns.reduce((acc, column) => {
    const label =
      (column.columnDef.meta as { label?: string })?.label || column.id;
    acc[column.id] = label;
    return acc;
  }, {} as Record<string, string>);

  const toggleColumn = (columnId: string) => {
    setColumnVisibility((prev) => {
      const newVisibility = { ...prev, [columnId]: !prev[columnId] };
      table.getColumn(columnId)?.toggleVisibility(newVisibility[columnId]);
      return newVisibility;
    });
  };
  return (
    <Dropdown drop="up" className="d-inline-block">
      <Dropdown.Toggle variant="link" className="btn-sm p-0 m-0">
        Настроить столбцы
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-column-menu dropdown-scrollable">
        {Object.entries(columnVisibility).map(([column, isVisible]) => (
          <Dropdown.Item key={column} className="d-flex align-items-center">
            <div className="form-check h-auto w-100 d-flex align-items-center ps-0">
              <input
                id={column}
                className="custom-control-input"
                type="checkbox"
                checked={isVisible}
                onClick={() => toggleColumn(column)}
              />
              <label
                htmlFor={column}
                className="form-check-label d-block w-100 cursor ms-2 user-select-none"
              >
                {columnLabels[column]}
              </label>
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
