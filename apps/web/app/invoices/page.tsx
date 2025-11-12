'use client';
import Protected from '@/components/Protected';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Invoice = { id: string; number: number; status: string; total: number; paidAmount: number; pdfUrl?: string };

export default function InvoicesPage() {
  const [data, setData] = useState<Invoice[]>([]);
  useEffect(() => { api.get('/invoices').then(r => setData(r.data)); }, []);

  return (
    <Protected>
      <main className="grid">
        <h1>Rechnungen</h1>
        <div className="card">
          {data.length === 0 ? <p>Noch keine Rechnungen.</p> : (
            <table className="table">
              <thead><tr><th>#</th><th>Status</th><th>Summe</th><th>Bezahlt</th><th>PDF</th></tr></thead>
              <tbody>
                {data.map(inv => (
                  <tr key={inv.id}>
                    <td>{inv.number}</td>
                    <td>{inv.status}</td>
                    <td>{Number(inv.total ?? 0).toFixed(2)} €</td>
                    <td>{Number(inv.paidAmount ?? 0).toFixed(2)} €</td>
                    <td>{inv.pdfUrl ? <a className="btn" href={inv.pdfUrl} target="_blank">Öffnen</a> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </Protected>
  );
}
