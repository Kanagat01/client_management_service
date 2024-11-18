import { useState, useEffect, ChangeEvent } from "react";

export const useModalState = (initialState: boolean): [boolean, () => void] => {
  const [state, setState] = useState<boolean>(initialState);
  const changeState = () => setState(!state);
  return [state, changeState];
};

export const useTextInputState = (
  initialState: string
): [
  string,
  (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
] => {
  const [state, setState] = useState<string>(initialState);
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setState(e.target.value);
  return [state, onChange];
};

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};
