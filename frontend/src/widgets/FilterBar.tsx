import { ReactNode } from "react";
import { Button } from "react-bootstrap";
import { BsArrowRepeat, BsFunnel } from "react-icons/bs";

type FilterBarProps = {
  filters: [string, ReactNode][];
};

export function FilterBar(props: FilterBarProps) {
  return (
    <div className="g-0 bg-white rounded mb-3">
      <div className="row align-items-center p-4" data-controller="filter">
        {props.filters.map(([label, filter], key) => (
          <div
            key={key}
            className="col-sm-auto col-md mb-3 align-self-start"
            style={{ minWidth: "200px" }}
          >
            <div className="form-group">
              <label className="form-label">{label}</label>
              {filter}
            </div>
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
