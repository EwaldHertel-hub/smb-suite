"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/layoutSlice";
import { toggleTheme } from "@/store/slices/themeSlice";

export default function Topbar() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          className="icon-button"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <div>
          <div className="topbar__title">Dashboard</div>
          <div className="topbar__subtitle">Übersicht & Statistiken</div>
        </div>
      </div>
      <div className="topbar__right">
        <button
          className="icon-button"
          onClick={() => dispatch(toggleTheme())}
          aria-label="Toggle theme"
        >
          {mode === "dark" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
