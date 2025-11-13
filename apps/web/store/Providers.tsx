"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./index";
import { useAppSelector } from "./hooks";

function ThemeApplier({ children }: { children: React.ReactNode }) {
  const mode = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", mode);
    }
  }, [mode]);

  return <>{children}</>;
}

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <ThemeApplier>{children}</ThemeApplier>
  </Provider>
);