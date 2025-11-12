"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Quote = { id: string; number: number; total: number; status: string };
export default function QuotesPage() {
  const [data, setData] = useState<Quote[]>([]);
  useEffect(() => {
    api.get("/quotes").then((r) => setData(r.data));
  }, []);
  return (
    <div>
      <h2>Angebote</h2>
      <div className="card">
        {data.length === 0 ? (
          <p>Noch keine Angebote.</p>
        ) : (
          <ul>
            {data.map((q) => (
              <li key={q.id}>
                #{q.number} – {q.total.toFixed(2)} € – {q.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
