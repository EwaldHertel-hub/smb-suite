"use client";

import React from "react";
import "@/styles/layout.scss";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="layout">
      <div className="layout__main">
        <main className="layout__content">{children}</main>
      </div>
    </div>
  );
}