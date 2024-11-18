import { ReactNode } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useModalState } from "~/shared/lib";
import styles from "./styles.module.scss";

type CollapsableSidebarProps = {
  children: ReactNode;
  collapsed?: boolean;
  toggleExpand?: () => void;
};

export function CollapsableSidebar({
  children,
  collapsed,
  toggleExpand,
}: CollapsableSidebarProps) {
  const [show, changeShow] = useModalState(false);
  collapsed = collapsed ?? show;
  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div
        className={styles["expand-btn"]}
        onClick={toggleExpand ?? changeShow}
      >
        <FaAngleLeft />
      </div>
      <div className={styles.content}>{collapsed ? children : ""}</div>
    </div>
  );
}
