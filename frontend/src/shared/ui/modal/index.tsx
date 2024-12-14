export const Modal = () => (
  <div
    className="modal fade"
    id="confirm-dialog"
    data-controller="confirm"
    tabIndex={-1}
    aria-hidden="true"
  >
    <div className="modal-dialog modal-fullscreen-md-down">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title text-black fw-light">Вы уверены?</h4>
          <button
            type="button"
            className="btn-close"
            title="Close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="p-4" data-confirm-target="message"></div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-link"
            data-bs-dismiss="modal"
          >
            Отменить
          </button>

          <div data-confirm-target="button"></div>
        </div>
      </div>
    </div>
  </div>
);
