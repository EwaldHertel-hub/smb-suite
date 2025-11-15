"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  useGetClientByIdQuery,
  useGetClientEmployeesQuery,
} from "@/store/api/apiSlice";
import Protected from "@/components/Protected";

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";
  const router = useRouter();

  const { data: client, isLoading: loadingClient } = useGetClientByIdQuery(id);
  const { data: employees = [], isLoading: loadingEmp } =
    useGetClientEmployeesQuery(id);
  const [clientForm, setClientForm] = useState<any>({});
  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    if (client && !formInitialized) {
      setClientForm(client);
      setFormInitialized(true);
    }
  }, [client, formInitialized]);

  if (loadingClient) {
    return (
      <Protected>
        <main className="grid">
          <div className="card">Lade Kunde...</div>
        </main>
      </Protected>
    );
  }

  if (!client) {
    return (
      <Protected>
        <main className="grid">
          <div className="card">
            <p>Kunde nicht gefunden.</p>
            <button className="btn" onClick={() => router.push("/clients")}>
              Zurück
            </button>
          </div>
        </main>
      </Protected>
    );
  }

  return (
    <Protected>
      <main className="grid">
        <div
          className="row"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <h1>Kunde: {client.name}</h1>
          <button className="btn" onClick={() => router.push("/clients")}>
            ← Zurück
          </button>
        </div>

        {/* kleine Tab-Navigation basierend auf Query-Param */}
        <div className="row" style={{ gap: 8 }}>
          <button
            className="btn"
            onClick={() => router.push(`/clients/${id}?tab=overview`)}
          >
            Stammdaten
          </button>
          <button
            className="btn"
            onClick={() => router.push(`/clients/${id}?tab=employees`)}
          >
            Mitarbeiter
          </button>
        </div>

        {tab === "overview" && (
          <div className="card" style={{ marginTop: 16 }}>
            {/* Stammdaten-Formular hier */}
            <p>Hier kommen die Stammdaten hin.</p>
          </div>
        )}

        {tab === "employees" && (
          <div className="card" style={{ marginTop: 16 }}>
            {loadingEmp ? (
              <p>Lade Mitarbeiter...</p>
            ) : employees.length === 0 ? (
              <p>Keine Mitarbeiter hinterlegt.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Abteilung</th>
                    <th>E-Mail</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e: any) => (
                    <tr key={e.id}>
                      <td>
                        {e.firstName} {e.lastName}
                      </td>
                      <td>{e.department ?? "—"}</td>
                      <td>{e.email ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </Protected>
  );
}
