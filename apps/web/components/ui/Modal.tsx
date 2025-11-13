"use client";

import React, { useEffect, useCallback, useState } from "react";
import ReactDOM from "react-dom";
import "@/styles/components/modal.scss";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeOnBackdropClick = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  // Portal erst nach Mount, damit SSR nicht knallt
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // scroll lock

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !mounted) return null;
  if (typeof document === "undefined") return null;

  const modalContent = (
    <div
      className="modal-overlay"
      onClick={closeOnBackdropClick ? onClose : undefined}
    >
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <header className="modal__header">
          {title && <h2 className="modal__title">{title}</h2>}
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Modal schließen"
          >
            ✕
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
