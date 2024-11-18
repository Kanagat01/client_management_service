import { InputHTMLAttributes, FC, CSSProperties } from "react";
import { FiSearch } from "react-icons/fi";
import styles from "./styles.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerStyle?: CSSProperties;
  iconOnClick?: () => void;
  withoutIcon?: boolean;
}

export const SearchInput: FC<InputProps> = ({
  containerStyle,
  withoutIcon = false,
  iconOnClick,
  ...props
}) => {
  return (
    <div className={styles["search-box"]} style={containerStyle}>
      <input className={styles["search-input"]} type="text" {...props} />
      {!withoutIcon && (
        <span
          className={styles["search-icon"]}
          onClick={iconOnClick}
          style={iconOnClick ? { cursor: "pointer" } : {}}
        >
          <FiSearch className="w-100 h-100" />
        </span>
      )}
    </div>
  );
};
