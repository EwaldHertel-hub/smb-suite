import "../styles/globals.scss";
import { Providers } from "@/store/provider";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <Providers>
          <div className="container">
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/clients">Kunden</Link>
              <Link href="/quotes">Angebote</Link>
              <Link href="/invoices">Rechnungen</Link>
              <Link href="/login" style={{ marginLeft: "auto" }}>
                Login
              </Link>
            </nav>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
