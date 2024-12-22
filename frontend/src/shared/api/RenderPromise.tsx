import { useState, useEffect, ReactNode, PropsWithChildren } from "react";
import styles from "./styles.module.scss";

const CenteredPreloader = () => {
  return (
    <div className={styles.center}>
      {Array.from({ length: 5 }).map((_, key) => (
        <div key={key} className={styles.wave}></div>
      ))}
    </div>
  );
};

const ErrorDiv = ({ children }: PropsWithChildren) => (
  <div className="text-center p-5 mt-5">
    <div style={{ fontSize: "2.5rem", fontWeight: 500 }}>{children}</div>
  </div>
);

type Handlers<T, E> = {
  loading?: ReactNode;
  success: ((data: T) => ReactNode) | ReactNode;
  error?: ((error: E) => ReactNode) | ReactNode;
};

export function RenderPromise<T, E = Error>(
  promiseFn: () => Promise<T>,
  handlers: Handlers<T, E>
) {
  const { loading = <CenteredPreloader />, success, error } = handlers;
  const [state, setState] = useState<{
    loading: boolean;
    data: T | null;
    error: E | null;
  }>({
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    promiseFn()
      .then((data) => {
        if (isMounted) {
          setTimeout(
            () => setState({ loading: false, data, error: null }),
            1000
          );
        }
      })
      .catch((err: E) => {
        if (isMounted) {
          setState({ loading: false, data: null, error: err });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [promiseFn]);

  if (state.loading) {
    return loading;
  } else if (state.data) {
    return typeof success === "function" ? success(state.data) : success;
  } else {
    if (!error && state.error instanceof Error) {
      return (
        <ErrorDiv>
          {state.error.name} {state.error.message}
        </ErrorDiv>
      );
    }
    if (state.error)
      return typeof error === "function" ? error(state.error) : error;
    return <ErrorDiv>Неизвестная ошибка: {state.error as ReactNode}</ErrorDiv>;
  }
}
