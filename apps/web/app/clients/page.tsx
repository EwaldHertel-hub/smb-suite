"use client";
import Protected from "@/components/Protected";
import {
  useGetClientsQuery,
  useCreateClientMutation,
} from "@/store/api/apiSlice";
import { useState } from "react";

export default function ClientsPageRedux() {
  const { data = [], isLoading, refetch } = useGetClientsQuery();
  const [createClient, { isLoading: saving }] = useCreateClientMutation();
  const [form, setForm] = useState({ name: "", email: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createClient(form).unwrap();
    setForm({ name: "", email: "" });
  };

  return (
    <Protected>
      <main className="grid">
        <h1>Kunden</h1>
        <div className="card">
          <form className="row" onSubmit={submit}>
            <div style={{ minWidth: 220, flex: "1 1 220px" }}>
              <div className="label">Name</div>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div style={{ minWidth: 220, flex: "1 1 220px" }}>
              <div className="label">E-Mail</div>
              <input
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <button
              className="btn primary"
              disabled={saving}
              style={{ alignSelf: "end" }}
            >
              {saving ? "Speichern…" : "Anlegen"}
            </button>
          </form>
        </div>
        <div className="card" style={{ marginTop: 16 }}>
          {isLoading ? (
            <p>Laden…</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>E-Mail</th>
                </tr>
              </thead>
              <tbody>
                {data.map((c: any) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.email ?? "—"}</td>
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
