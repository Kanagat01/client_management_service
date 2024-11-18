import { useTranslation } from "react-i18next";
import { FC, HTMLAttributes, ReactNode } from "react";
import { TextCenter, TitleMd } from "~/shared/ui";
import styles from "./styles.module.scss";

type RoundedTableProps = HTMLAttributes<HTMLTableElement> & {
  columns?: ReactNode[];
  data: ReactNode[][];
  lightBorderMode?: boolean;
  layoutFixed?: boolean;
};

export const RoundedTable: FC<RoundedTableProps> = ({
  columns,
  data,
  lightBorderMode = false,
  layoutFixed = true,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={`${styles.tableResponsive} ${
        lightBorderMode ? styles.lightBorder : ""
      }`}
    >
      <table
        {...props}
        className={`${styles.table} ${
          lightBorderMode ? styles.lightBorder : ""
        } ${props.className}`}
        style={
          layoutFixed ? { tableLayout: "fixed", ...props.style } : props.style
        }
      >
        {columns ? (
          <thead>
            <tr>
              {columns.map((column, key) => (
                <th key={key}>{column}</th>
              ))}
            </tr>
          </thead>
        ) : (
          ""
        )}
        <tbody>
          {data.length !== 0 ? (
            data.map((arr, key1) => (
              <tr key={key1}>
                {arr.map((value, key2) => (
                  <td key={key2}>{value}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns?.length}>
                <TextCenter>
                  <TitleMd className="p-3">{t("common.noData")}</TitleMd>
                </TextCenter>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
