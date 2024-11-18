import { t } from "i18next";
import { MouseEvent, ReactNode } from "react";

export const handleClick = (
  event: MouseEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSpanElement>
) => {
  const target = event.target as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSpanElement;
  let text;
  if ("value" in target) text = target.value.toString();
  else text = target.textContent as string;
  navigator.clipboard.writeText(text).then(() => {
    const parent = target.closest(".position-relative");
    let toast = parent!.querySelector(".toast-copied") as HTMLElement;
    if (!toast) {
      toast = document.createElement("div") as HTMLElement;
      toast.className = "toast-copied";
      if (!("value" in target)) {
        toast.style.top = "-30px";
        toast.style.left = "-5px";
      }
      toast.innerText = t("common.copied");
      parent?.appendChild(toast);
    }
    setTimeout(() => {
      toast.style.zIndex = "10";
      toast.classList.add("visible");
    }, 100);
    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => (toast.style.zIndex = "-1"), 500);
    }, 1000);
  });
};

export const copyOnClickWrapper = (value: ReactNode) => (
  <div className="position-relative cursor-pointer">
    <span className="d-block w-100" onClick={handleClick}>
      {value}
    </span>
  </div>
);
