import Link from "next/link";
export default function Home() {
  return (
    <main>
      <h1>Business Cockpit</h1>
      <div className="card" style={{ display: "grid", gap: 16 }}>
        <p>
          Willkommen! Starte mit Angeboten und Rechnungen oder öffne das
          Dashboard.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/quotes" className="btn">
            Angebote
          </Link>
          <Link href="/invoices" className="btn">
            Rechnungen
          </Link>
          <Link href="/clients" className="btn">
            Kunden
          </Link>
          <Link href="/dashboard" className="btn">
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
