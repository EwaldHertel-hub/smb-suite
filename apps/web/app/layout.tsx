import type { Metadata } from "next";
import React from "react";
import "../styles/globals.scss";
import { Providers } from "@/store/Providers";
import AppShell from "@/components/layout/AppShell";
import { AuthInit } from "@/components/AuthInit";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Next.js + TS + Redux + Sass Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
