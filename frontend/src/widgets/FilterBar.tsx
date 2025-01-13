import { ReactNode } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import { BsArrowRepeat } from "react-icons/bs";
import { resetFilters } from "~/features/filters";

type FilterBarProps = {
  getFilters: () => ReactNode[];
};

export function FilterBar(props: FilterBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReset = () => {
    resetFilters();
    navigate(location.pathname);
  };
  // const applyFilters = () => {
  //   const searchParams = new URLSearchParams(location.search);
  //   Object.entries($filters.getState()).map(([key, value]) =>
  //     searchParams.set(key, value)
  //   );
  //   navigate(`${location.pathname}?${searchParams.toString()}`);
  // };

  return (
    <div className="g-0 bg-white rounded mb-3">
      <div className="row align-items-center p-4" data-controller="filter">
        {props.getFilters().map((filter, key) => (
          <div
            key={key}
            className="col-sm-auto col-md mb-3 align-self-start"
            style={{ minWidth: "200px" }}
          >
            {filter}
          </div>
        ))}
        <div className="col-sm-auto ms-auto text-end">
          <div className="btn-group" role="group">
            <Button
              variant="default"
              onClick={handleReset}
              style={{ height: "fit-content" }}
            >
              <BsArrowRepeat className="me-1" />
              Сбросить
            </Button>
            {/* <Button
              variant="default"
              onClick={applyFilters}
              style={{ height: "fit-content" }}
            >
              <BsFunnel className="me-1" />
              Применить
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
