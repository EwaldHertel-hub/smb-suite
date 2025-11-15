"use client";

import { useParams, useRouter } from "next/navigation";
import Protected from "@/components/Protected";
import { useGetProjectByIdQuery } from "@/store/slices/projectsApi";
import Tasks from "@/components/projects/Tasks";
import Link from "next/link";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: project, isLoading, isError } = useGetProjectByIdQuery(id);

  if (isLoading) {
    return (
      <Protected>
        <main className="grid">
          <div className="card">Lade Projekt...</div>
        </main>
      </Protected>
    );
  }

  if (!project || isError) {
    return (
      <Protected>
        <main className="grid">
          <div className="card">
            <p>Projekt nicht gefunden.</p>
            <button className="btn" onClick={() => router.push("/projects")}>
              Zurück zur Übersicht
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
          <h1>{project.name}</h1>
          <button className="btn" onClick={() => router.push("/projects")}>
            ← Zurück
          </button>
        </div>

        <div className="card">
          <h2>Projektinfo</h2>
          <p>
            <strong>Kunde:</strong>{" "}
            {project.client ? (
              <Link href={`/clients/${project.client.id}`} className="btn">
                {project.client.name}
              </Link>
            ) : (
              "—"
            )}
          </p>
          <p>
            <strong>Mitarbeiter:</strong> {project.user.name || "—"}
          </p>
          <p>
            <strong>Status:</strong> {project.status}
          </p>
          <p>
            <strong>Abrechnung:</strong> {project.billingType}
          </p>
          {project.hourlyRate && (
            <p>
              <strong>Stundensatz:</strong> {project.hourlyRate} €
            </p>
          )}
          {project.budgetHours && (
            <p>
              <strong>Budget:</strong> {project.budgetHours} Std.
            </p>
          )}
          {project.repoUrl && (
            <p>
              <strong>Repo:</strong>{" "}
              <a href={project.repoUrl} target="_blank" className="btn">
                öffnen
              </a>
            </p>
          )}
          {project.techStack && (
            <p>
              <strong>Tech-Stack:</strong> {project.techStack}
            </p>
          )}
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <h2>Angebote</h2>
          {project.quotes?.length === 0 ? (
            <p>Keine Angebote verknüpft.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Status</th>
                  <th>Summe</th>
                  <th>Datum</th>
                </tr>
              </thead>
              <tbody>
                {project.quotes.map((q: any) => (
                  <tr key={q.id}>
                    <td>{q.number}</td>
                    <td>{q.status}</td>
                    <td>{q.total} €</td>
                    <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <h2>Rechnungen</h2>
          {project.invoices?.length === 0 ? (
            <p>Keine Rechnungen verknüpft.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Status</th>
                  <th>Summe</th>
                  <th>Datum</th>
                </tr>
              </thead>
              <tbody>
                {project.invoices.map((inv: any) => (
                  <tr key={inv.id}>
                    <td>{inv.number}</td>
                    <td>{inv.status}</td>
                    <td>{inv.total} €</td>
                    <td>{new Date(inv.issueDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Tasks id={id} />
      </main>
    </Protected>
  );
}
