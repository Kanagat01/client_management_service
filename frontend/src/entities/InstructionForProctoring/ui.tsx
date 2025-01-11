import { useEffect, useState } from "react";
import { useUnit } from "effector-react";
import { API_URL } from "~/shared/config";
import { BsInput, CreateOrEditBtn } from "~/shared/ui";
import { $instructionForProctoring, createOrUpdateInstruction } from "./model";

export function CreateOrEditInstructionForProctoring() {
  const instruction = useUnit($instructionForProctoring);
  const [data, setData] = useState(instruction);
  useEffect(() => {
    setData(instruction);
  }, [instruction]);

  const isEdit = data && "id" in data;

  const onReset = () => setData(instruction);
  const onSubmit = (changeShow: () => void) => {
    createOrUpdateInstruction({ ...data, changeShow });
  };
  return (
    <CreateOrEditBtn
      variant={isEdit ? "edit" : "add"}
      title={`${
        isEdit ? "Редактировать" : "Создать"
      } инструкцию для прокторинга`}
      variantText="Инструкция для прокторинга"
      inputs={
        <div className="d-flex flex-column" style={{ gap: "1rem" }}>
          <BsInput
            variant="textarea"
            label="Текст инструкции"
            value={data?.text}
            onChange={(e) => setData({ ...data, text: e.target.value })}
          />

          <BsInput
            variant="input"
            label="Видео инструкция"
            onChange={(e) => setData({ ...data, video: e.target.files?.[0] })}
            type="file"
          />
          {typeof data?.video === "string" && <CurrentFile file={data.video} />}

          <BsInput
            variant="input"
            label="Файл инструкции"
            onChange={(e) => setData({ ...data, file: e.target.files?.[0] })}
            type="file"
          />
          {typeof data?.file === "string" && <CurrentFile file={data.file} />}
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
    />
  );
}

const CurrentFile = ({ file }: { file: string }) => (
  <a
    href={API_URL + file}
    className="form-label"
    style={{
      fontWeight: 400,
      color: "var(--bs-primary)",
      textDecoration: "underline",
      marginTop: "-0.6rem",
    }}
    target="_blank"
  >
    Посмотреть
  </a>
);
