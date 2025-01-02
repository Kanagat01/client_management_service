import { useEffect, useState, FC } from "react";
import Select from "react-select";

type TOption = { value: string; label: string };

type SelectInputProps = {
  label: string;
  name?: string;
  placeholder?: string;
  value?: string;
  options: TOption[];
  onChange?: (value: string) => void;
  required?: boolean;
};

export const SelectInput: FC<SelectInputProps> = ({
  label,
  options,
  placeholder = "",
  value,
  onChange,
  ...selectProps
}) => {
  const [selectedValue, setSelectedValue] = useState<TOption | null>(null);

  useEffect(() => {
    if (value) {
      const option = options.find((option) => option.value === value);
      setSelectedValue(option || null);
    }
  }, [value, options]);

  const handleChange = (selectedOption: TOption | null) => {
    setSelectedValue(selectedOption);
    if (onChange) {
      onChange(selectedOption?.value || "");
    }
  };

  return (
    <div className="form-group" data-controller="select">
      <label htmlFor={`field-${selectProps.name}`} className="form-label">
        {label}
      </label>
      <Select
        value={selectedValue}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        styles={{
          control: (provided: any) => ({
            ...provided,
            appearance: "none",
            background: "#fff none",
            border: "1px solid rgba(21, 20, 26, 0.1)",
            borderRadius: "0.125rem",
            boxShadow: "none",
            color: "#15141a",
            minHeight: "2.45rem",
            outline: 0,
          }),
          dropdownIndicator: (provided: any) => ({
            ...provided,
            display: "none",
          }),
          indicatorsContainer: (provided: any) => ({
            ...provided,
            display: "none",
          }),
        }}
        noOptionsMessage={() => "Нет результатов"}
        isClearable
        {...selectProps}
      />
    </div>
  );
};
