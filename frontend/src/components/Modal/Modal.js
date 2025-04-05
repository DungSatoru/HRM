import React, { useState } from 'react';
import './Modal.css';

const Modal = ({
  title = 'Modal title',
  showModal = false,
  onClose,
  onSave,
  saveButtonText = 'Save changes',
  closeButtonText = 'Close',
  children,
}) => {
  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSave = () => {
    if (onSave) onSave();
  };

  if (!showModal) return null;

  return (
    <div className="modal-backdrop">
      <div
        className={`modal ${showModal ? 'show' : ''}`}
        style={{ display: showModal ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalLabel">
                {title}
              </h5>
              <button type="button" className="close" onClick={handleClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                {closeButtonText}
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                {saveButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
