import type { Metadata } from "next";
import React from "react";
import "../styles/globals.scss";
import { Providers } from "@/store/Providers";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "SMB-Suite",
  description: "The Suite of Tools for small and medium businesses",
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
