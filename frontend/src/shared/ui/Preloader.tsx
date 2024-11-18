import { Spinner } from "react-bootstrap";

export function Preloader({
  full_screen_mode,
}: {
  full_screen_mode?: boolean;
}) {
  return (
    <div
      className="d-flex align-items-center justify-content-center mt-5"
      style={full_screen_mode ? { height: "100vh" } : {}}
    >
      <Spinner variant="primary" style={{ width: "15rem", height: "15rem" }} />
    </div>
  );
}
