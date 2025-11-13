"use client";

import React from "react";
import Layout from "@/components/layout/index";
import StatBox from "@/components/ui/StatBox";

export default function DashboardPage() {
  return (
      <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div className="stat-grid">
          <StatBox
            title="Einnahmen"
            value="€ 12.430"
            progress={0.75}
            change="+14%"
            description="im Vergleich zum letzten Monat"
          />
          <StatBox
            title="Bestellungen"
            value="1.239"
            progress={0.5}
            change="+3%"
            description="heute"
          />
          <StatBox
            title="Kunden"
            value="842"
            progress={0.63}
            change="+8%"
            description="diese Woche"
          />
        </div>
        {/* hier kannst du Charts, Tabellen etc. einhängen */}
      </section>
  );
}
