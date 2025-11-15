"use client";

import Protected from "@/components/Protected";
import StatBox from "@/components/ui/StatBox";

export default function Home() {
  return (
    <Protected>
      <main className="grid">
        <h1>Business Cockpit</h1>
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
      </main>
    </Protected>
  );
}
