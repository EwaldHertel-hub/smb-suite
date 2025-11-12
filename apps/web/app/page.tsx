import Link from "next/link";

export default function Home() {
  return (
    <main className="grid">
      <h1>Business Cockpit</h1>
      <div className="row">
        <Link href="/quotes" className="btn">
          Angebote
        </Link>
        <Link href="/invoices" className="btn">
          Rechnungen
        </Link>
        <Link href="/clients" className="btn">
          Kunden
        </Link>
        <Link href="/dashboard" className="btn primary">
          Dashboard
        </Link>
      </div>
    </main>
  );
}
