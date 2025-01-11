import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useUnit } from "effector-react";
import { API_URL } from "~/shared/config";
import { BsInput, CreateOrEditBtn } from "~/shared/ui";
import {
  $instructionForProctoring,
  createInstruction,
  partialUpdateInstruction,
} from "./model";
import { TInstructionForProctoring } from "./types";
import toast from "react-hot-toast";

export function CreateOrEditInstructionForProctoring() {
  const instruction = useUnit($instructionForProctoring);
  const isEdit = "id" in instruction;

  const [data, setData] = useState<TInstructionForProctoring>({
    text: instruction.text,
  });
  useEffect(() => {
    setData({ text: instruction.text });
  }, [instruction]);

  const inputRefs = {
    file: useRef<HTMLInputElement | null>(null),
    video: useRef<HTMLInputElement | null>(null),
  };
  const [clearMedia, setClearMedia] = useState({ file: false, video: false });

  const onReset = () => {
    setData({ text: instruction.text });
    setClearMedia({ file: false, video: false });
  };
  const onSubmit = (changeShow: () => void) => {
    const args = {
      ...data,
      changeShow: () => {
        changeShow();
        onReset();
      },
    };

    let bothAreFilled = false;
    Object.entries(inputRefs).map(([key, value]) => {
      const file = value.current?.files?.[0];
      const field = key as "file" | "video";
      if (file) {
        args[field] = file;
      }
      if (clearMedia[field]) {
        if (file) bothAreFilled = true;
        else args[field] = null;
      }
      return;
    });
    if (bothAreFilled) {
      toast.error(
        `Пожалуйста, загрузите файл или поставьте флажок "Очистить", но не совершайте оба действия одновременно.`
      );
      return;
    }

    if (isEdit) partialUpdateInstruction({ ...args, id: Number(data?.id) });
    else createInstruction(args);
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
            value={data?.text ?? ""}
            onChange={(e) => setData({ ...data, text: e.target.value })}
          />

          <BsInput
            inputRef={inputRefs.video}
            variant="input"
            label="Видео инструкция"
            type="file"
            accept=".mp4,.mov,.avi,.mkv"
          />
          <CurrentFile
            fileName={instruction.video as string | undefined}
            checkboxValue={clearMedia.video}
            checkboxOnChange={({ target }) =>
              setClearMedia((prevState) => ({
                ...prevState,
                video: target.checked,
              }))
            }
          />

          <BsInput
            inputRef={inputRefs.file}
            variant="input"
            label="Файл инструкции"
            type="file"
          />
          <CurrentFile
            fileName={instruction.file as string | undefined}
            checkboxValue={clearMedia.file}
            checkboxOnChange={({ target }) =>
              setClearMedia((prevState) => ({
                ...prevState,
                file: target.checked,
              }))
            }
          />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
    />
  );
}

const CurrentFile = ({
  fileName,
  checkboxValue,
  checkboxOnChange,
}: {
  fileName?: string;
  checkboxValue: boolean;
  checkboxOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="d-flex align-items-start">
    {fileName && (
      <div className="form-label d-inline mb-0 me-4">
        На данный момент:{" "}
        <a
          href={API_URL + fileName}
          style={{
            fontWeight: 400,
            color: "var(--bs-primary)",
            textDecoration: "underline",
          }}
          target="_blank"
        >
          {decodeURIComponent(fileName.split("/").pop() ?? "")}
        </a>
      </div>
    )}
    <BsInput
      variant="checkbox"
      label="Очистить"
      checked={checkboxValue}
      onChange={checkboxOnChange}
      place_horisontal
    />
  </div>
);
