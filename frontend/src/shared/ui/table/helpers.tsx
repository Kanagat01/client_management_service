import { useState, PropsWithChildren, ReactNode } from "react";
import { ColumnHelper } from "@tanstack/react-table";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";

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
  actions: ReactNode[]
) => {
  return columnHelper.display({
    id: "column_actions",
    header: () => (
      <th className="text-center" style={{ width: "100px" }}>
        <div className="d-inline-flex align-items-center">{header}</div>
      </th>
    ),
    cell: () => (
      <td className="text-center" colSpan={1} style={{ minWidth: "100px" }}>
        <div>
          <div className="form-group mb-0">
            <button
              className="btn btn-link icon-link"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              data-bs-popper-config='{"strategy": "fixed"}'
            >
              <BsThreeDotsVertical />
            </button>

            <div
              className="dropdown-menu dropdown-menu-end dropdown-menu-arrow bg-white"
              x-placement="bottom-end"
            >
              {actions.map((action) => (
                <div className="form-group mb-0">{action}</div>
              ))}
            </div>
          </div>
        </div>
      </td>
    ),
  });
};

export const ColumnSelector = () => {
  const [columns, setColumns] = useState({
    id: true,
    code: true,
    "group-id": true,
    description: true,
    "created-at": true,
    "updated-at": true,
  });

  const toggleColumn = (column: keyof typeof columns) => {
    setColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const getColumnLabel = (column: string) => {
    const labels: Record<string, string> = {
      id: "ID",
      code: "Код",
      "group-id": "ID группы",
      description: "Описание",
      "created-at": "Дата создания",
      "updated-at": "Последнее изменение",
    };
    return labels[column] || column;
  };

  return (
    <Dropdown drop="up" className="d-inline-block">
      <Dropdown.Toggle variant="link" className="btn-sm p-0 m-0">
        Настроить столбцы
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-column-menu dropdown-scrollable">
        {Object.entries(columns).map(([column, isVisible]) => (
          <Dropdown.Item key={column} className="d-flex align-items-center">
            <div className="form-check h-auto w-100 d-flex align-items-center ps-0">
              <input
                id={column}
                className="custom-control-input"
                type="checkbox"
                checked={isVisible}
                onClick={() => toggleColumn(column as keyof typeof columns)}
              />
              <label
                htmlFor={column}
                className="form-check-label d-block w-100 cursor ms-2 user-select-none"
              >
                {getColumnLabel(column)}
              </label>
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
