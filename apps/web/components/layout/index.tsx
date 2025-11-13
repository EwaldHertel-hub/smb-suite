"use client";

import React from "react";
import "@/styles/layout.scss";
import { useAppSelector } from "@/store/hooks";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSidebarOpen = useAppSelector((state) => state.layout.isSidebarOpen);

  return (
    <div className="layout">
      {isSidebarOpen && <Sidebar />}
      <div className="layout__main">
        <Topbar />
        <main className="layout__content">{children}</main>
      </div>
    </div>
  );
}