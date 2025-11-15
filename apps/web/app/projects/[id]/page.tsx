"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Protected from "@/components/Protected";
import { useGetProjectByIdQuery } from "@/store/slices/projectsApi";
import {
  useGetProjectTasksQuery,
  useCreateProjectTaskMutation,
  useUpdateProjectTaskMutation,
  useDeleteProjectTaskMutation,
} from "@/store/slices/taskApi";
import Link from "next/link";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: project, isLoading, isError } = useGetProjectByIdQuery(id);
  const { data: tasks = [], isLoading: loadingTasks } =
    useGetProjectTasksQuery(id);

  const [createTask, { isLoading: creatingTask }] =
    useCreateProjectTaskMutation();
  const [updateTask, { isLoading: updatingTask }] =
    useUpdateProjectTaskMutation();
  const [deleteTask, { isLoading: deletingTask }] =
    useDeleteProjectTaskMutation();

  const [taskError, setTaskError] = useState<string | null>(null);

  const savingTask = creatingTask || updatingTask || deletingTask;

  const [taskForm, setTaskForm] = useState({
    title: "",
    priority: "MEDIUM",
  });

  const onCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskError(null);

    if (!taskForm.title) {
      setTaskError("Titel ist erforderlich.");
      return;
    }

    try {
      await createTask({
        projectId: id,
        data: {
          title: taskForm.title,
          priority: taskForm.priority,
        },
      }).unwrap();
      setTaskForm({ title: "", priority: "MEDIUM" });
    } catch (err: any) {
      console.error(err);
      setTaskError("Task konnte nicht angelegt werden.");
    }
  };

  const toggleStatus = async (task: any) => {
    const nextStatus =
      task.status === 'DONE' ? 'TODO' : 'DONE'; 
    try {
      await updateTask({
        projectId: id,
        taskId: task.id,
        data: { status: nextStatus },
      }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const removeTask = async (taskId: string) => {
    if (!confirm('Task wirklich löschen?')) return;
    try {
      await deleteTask({ projectId: id, taskId }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

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
         {/* 🔹 Tasks-Card */}
        <div className="card" style={{ marginTop: 16 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Tasks</h2>
            {savingTask && (
              <span style={{ fontSize: 12, color: '#9aa4b2' }}>Speichere...</span>
            )}
          </div>

          {taskError && (
            <div className="card" style={{ borderColor: '#b94a4a', color: '#ffbdbd' }}>
              {taskError}
            </div>
          )}

          {loadingTasks ? (
            <p>Lade Tasks...</p>
          ) : tasks.length === 0 ? (
            <p>Noch keine Tasks angelegt.</p>
          ) : (
            <table className="table" style={{ marginBottom: 16 }}>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Priorität</th>
                  <th>Titel</th>
                  <th>Fällig</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t: any) => (
                  <tr key={t.id}>
                    <td>
                      <button className="btn" onClick={() => toggleStatus(t)}>
                        {t.status === 'DONE' ? '✅ DONE' : '⬜ TODO'}
                      </button>
                    </td>
                    <td>{t.priority}</td>
                    <td>{t.title}</td>
                    <td>
                      {t.dueDate
                        ? new Date(t.dueDate).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="row">
                      {/* hier könntest du später ein Edit-Form einbauen */}
                      <button
                        className="btn"
                        onClick={() => removeTask(t.id)}
                        disabled={savingTask}
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Task anlegen */}
          <form className="grid" style={{ gap: 8 }} onSubmit={onCreateTask}>
            <h3>Neue Task anlegen</h3>
            <div className="row">
              <div style={{ flex: '3 1 260px' }}>
                <div className="label">Titel</div>
                <input
                  className="input"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                  placeholder="z.B. API für Projekte erweitern"
                  required
                />
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <div className="label">Priorität</div>
                <select
                  className="input"
                  value={taskForm.priority}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
            <div className="row" style={{ justifyContent: 'flex-end' }}>
              <button className="btn primary" disabled={creatingTask}>
                {creatingTask ? 'Hinzufügen...' : 'Task hinzufügen'}
              </button>
            </div>
          </form>
        </div>
        {/* Ende Tasks-Card */}
      </main>
    </Protected>
  );
}
