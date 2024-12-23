import { ReactNode } from "react";
import { Button } from "react-bootstrap";
import { BsArrowRepeat, BsFunnel } from "react-icons/bs";

type FilterBarProps = {
  filters: ReactNode[];
};

export function FilterBar(props: FilterBarProps) {
  return (
    <div className="g-0 bg-white rounded mb-3">
      <div className="row align-items-center p-4" data-controller="filter">
        {props.filters.map((filter, key) => (
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
            <Button variant="default" style={{ height: "fit-content" }}>
              <BsArrowRepeat className="me-1" />
              Сбросить
            </Button>
            <Button variant="default" style={{ height: "fit-content" }}>
              <BsFunnel className="me-1" />
              Применить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
