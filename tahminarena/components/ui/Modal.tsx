"use client";

import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export default function Modal({
  open,
  title,
  children,
  onClose,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="ui-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ui-modal-title"
    >
      <button
        type="button"
        className="ui-modal__backdrop"
        onClick={onClose}
        aria-label="Pencereyi kapat"
      />

      <div className="ui-modal__content">
        <div className="ui-modal__header">
          <h2
            id="ui-modal-title"
            className="ui-modal__title"
          >
            {title}
          </h2>

          <button
            type="button"
            className="ui-modal__close"
            onClick={onClose}
            aria-label="Kapat"
          >
            ×
          </button>
        </div>

        <div className="ui-modal__body">
          {children}
        </div>
      </div>
    </div>
  );
}