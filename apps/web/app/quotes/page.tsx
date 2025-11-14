"use client";

import Protected from "@/components/Protected";
import {
  useGetQuotesQuery,
  useSendQuoteMutation,
} from "@/store/slices/quotesApi";
import { useCreateInvoiceFromQuoteMutation } from "@/store/slices/invoicesApi";

export default function QuotesPageRedux() {
  const { data = [], isLoading } = useGetQuotesQuery();
  const [sendQuote] = useSendQuoteMutation();
  const [toInvoice] = useCreateInvoiceFromQuoteMutation();

  return (
    <Protected>
      <main className="grid">
        <h1>Angebote</h1>
        <div className="card">
          {isLoading ? (
            <p>Laden…</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Status</th>
                  <th>Summe</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {data.map((q: any) => (
                  <tr key={q.id}>
                    <td>{q.number}</td>
                    <td>{q.status}</td>
                    <td>{Number(q.total ?? 0).toFixed(2)} €</td>
                    <td className="row">
                      <button
                        className="btn"
                        onClick={() =>
                          sendQuote({ id: q.id })
                            .unwrap()
                            .then(() => alert("Versand angestoßen"))
                        }
                      >
                        Senden
                      </button>
                      <button
                        className="btn"
                        onClick={() =>
                          toInvoice({ quoteId: q.id })
                            .unwrap()
                            .then(() => alert("In Rechnung umgewandelt"))
                        }
                      >
                        → Rechnung
                      </button>
                    </td>
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
