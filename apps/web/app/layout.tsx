import type { Metadata } from "next";
import React from "react";
import "../styles/globals.scss"; // dein globales Sass
import { Providers } from "@/store/Providers";
import Layout from "@/components/layout";

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
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
