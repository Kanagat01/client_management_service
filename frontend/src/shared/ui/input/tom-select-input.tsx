import TomSelect from "tom-select";
import { useEffect, useRef } from "react";

interface TomSelectInputProps {
  label: string;
  options: { value: string; label: string }[];
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string | number) => void;
  required?: boolean;
}

export const TomSelectInput: React.FC<TomSelectInputProps> = ({
  label,
  options,
  placeholder = "",
  value,
  onChange,
  ...selectProps
}) => {
  const selectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    if (!selectRef.current) return;

    const tomSelectInstance = new TomSelect(selectRef.current, {
      placeholder: placeholder,
      allowEmptyOption: true,
      persist: false,
      onType: () => {
        tomSelectInstance.clear();
      },
      valueField: value,
      onChange: onChange,
      render: {
        no_results: () => {
          const noResultsDiv = document.createElement("div");
          noResultsDiv.className = "no-results";
          noResultsDiv.textContent = "Результаты не найдены";
          return noResultsDiv;
        },
      },
    });

    return () => {
      tomSelectInstance.destroy();
    };
  }, [onChange, placeholder]);

  return (
    <div className="form-group" data-controller="select">
      <label htmlFor={`field-${name}`} className="form-label">
        {label}
      </label>
      <div>
        <select
          ref={selectRef}
          id={`field-${selectProps.name}`}
          className="form-control tomselected ts-hidden-accessible"
          {...selectProps}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
